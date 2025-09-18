import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { client } from '@/API/ApolloClient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApolloProvider } from '@apollo/client/react';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getLastUpdatets } from '@/API/Kodik/getLatestUpdatets';
import { getToken } from '@/API/Kodik/getToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as BackgroundTask from "expo-background-task";
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { KeyboardProvider } from 'react-native-keyboard-controller';


const TASK_NAME = 'fetchLastUpdates';
const SAVE_KEY = 'lastSavedUpadtesAnime';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


const fetchLastUpdates = async (token: string) => {
    const rKodik = await getLastUpdatets(token);
    const result = rKodik[0];
    const data = {
        id: result.id,
        voice: result.translation.id,
        title: result.title,
        last_episode: result.last_episode,
        translation_title: result.translation.title,
    }
    return data;
}

TaskManager.defineTask(TASK_NAME, async () => {
    try {
        const registeredAtStr = await AsyncStorage.getItem('TASK_REGISTERED_AT');
        if (!registeredAtStr) return BackgroundFetch.BackgroundFetchResult.NoData;

        const registeredAt = parseInt(registeredAtStr, 10);
        const now = Date.now();
        const diffMs = now - registeredAt;
        const diffMinutes = Math.floor(diffMs / 60000);

        console.log(`⌛ Задача выполняется. Прошло минут: ${diffMinutes}`);

        await AsyncStorage.setItem('TASK_REGISTERED_AT', now.toString());

        const raw = await AsyncStorage.getItem(SAVE_KEY);
        const item = raw ? JSON.parse(raw) : null;

        const token = await getToken();
        const response = await fetchLastUpdates(token)

        if (!item) {
            return await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(response));
        } else {
            if (item?.id !== response.id && item?.voice !== response.voice) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `✨ Новая серия — ${response.title}`,
                        body: `Серия: ${response.last_episode}\nОзвучка: ${response.translation_title}`,
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                        subtitle: " ",
                    },
                    trigger: null,
                });
                await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(response));
                return BackgroundFetch.BackgroundFetchResult.NewData;
            } else {
                return await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `Новых серий нет :(`,
                        badge: 2,
                        body: 'уведомим когда будут',
                        sound: true,
                    },
                    trigger: null,
                });
            }
        }
    } catch (error) {
        console.error('❌ Background task failed:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});


export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const appState = useRef(AppState.currentState);


    useEffect(() => {
        const setup = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Нет разрешения на уведомления');
                return;
            }

            const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);

            const now = Date.now().toString();
            const registeredAtStr = await AsyncStorage.getItem('TASK_REGISTERED_AT');

            if (registeredAtStr) {
                const registeredAt = Number(registeredAtStr);
                const diff = Date.now() - registeredAt;
                const diffMinutes = Math.floor(diff / 60000);
                console.log(`🕒 С момента регистрации задачи прошло: ${diffMinutes} минут`);
            } else {
                console.log('🆕 Первая регистрация фоновой задачи');
                await AsyncStorage.setItem('TASK_REGISTERED_AT', now.toString());
            }

            if (!isRegistered) {
                await BackgroundTask.registerTaskAsync(TASK_NAME, {
                    minimumInterval: 15 * 60, // каждые 15 минут
                });
                const start = Date.now(); // 🟢 Время начала
                console.log(new Date(start).toLocaleTimeString(), '✅ Background fetch task registered');
            } else {
                const start = Date.now(); // 🟢 Время начала
                console.log(new Date(start).toLocaleTimeString(), 'ℹ️ Background fetch already registered');
            }
        };

        setup();
    }, []);

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener(
            "change",
            (nextAppState: AppStateStatus) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    const start = Date.now(); // 🟢 Время начала
                    console.log(new Date(start).toLocaleTimeString(), "App has come to the foreground!");
                }
                if (appState.current.match(/active/) && nextAppState === "background") {
                    const start = Date.now(); // 🟢 Время начала
                    console.log(new Date(start).toLocaleTimeString(), "App has gone to the background!");
                }
                appState.current = nextAppState;
            }
        );

        // Cleanup subscription on unmount
        return () => {
            appStateSubscription.remove();
        };
    }, [])

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ApolloProvider client={client}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <KeyboardProvider statusBarTranslucent>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
                            <Stack.Screen name="(experemental)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </KeyboardProvider>
                    <StatusBar translucent animated style='light' />
                </ThemeProvider>
            </ApolloProvider>
        </GestureHandlerRootView>
    );
}
