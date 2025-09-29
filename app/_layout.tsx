import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { client } from '@/API/ApolloClient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApolloProvider } from '@apollo/client/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Notifications from 'expo-notifications';
import { ActivityIndicator } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    if (!loaded) {
        return <ActivityIndicator size={'small'} color={'white'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
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
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </KeyboardProvider>
                    <StatusBar translucent animated style='light' />
                </ThemeProvider>
            </ApolloProvider>
        </GestureHandlerRootView>
    );
}
