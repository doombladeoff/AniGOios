import { ApolloProvider } from '@apollo/client/react';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { client } from '@/API/ApolloClient';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemeProvider } from '@/hooks/ThemeContext';
import { auth, db } from '@/lib/firebase';
import { CustomUser, useUserStore } from '@/store/userStore';
import { storage } from '@/utils/storage';
import { Image } from 'expo-image';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    const setUser = useUserStore(s => s.setUser);
    const isSkip = storage.getSkip();

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        const checkAuth = async () => {
            if (isSkip) {
                setIsAuth(true);
                setIsCheckingAuth(false);
                return;
            }

            const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    setUser(null);
                    setIsAuth(false);
                    setIsCheckingAuth(false);
                    return;
                }

                const userDocRef = doc(db, "user-collection", user.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (snap) => {
                    if (!snap.exists()) {
                        const defaultUser: CustomUser = {
                            ...user,
                            avatarURL: "",
                            bannerURL: "",
                            lastAnime: null,
                            watchStats: {
                                watchedEpisodes: 0,
                                watchTime: 0
                            },
                            rang: {
                                level: 1,
                                exp: 0,
                            },
                            friends: [],
                            folders: [],
                            yummyToken: '',
                            yummyTokenDate: '',
                        };
                        setUser(defaultUser);
                        setIsAuth(true);
                    } else {
                        const userData = snap.data() as Omit<CustomUser, keyof User>;
                        const combinedUser: CustomUser = { ...user, ...userData };
                        setUser(combinedUser);
                        setIsAuth(true);
                    }
                    setIsCheckingAuth(false);
                });

                return () => unsubscribeSnapshot();
            });

            return () => unsubscribeAuth();
        };

        checkAuth();
    }, []);

    if (!loaded || isCheckingAuth) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#e8b830" }}>
                <Image source={require('@/assets/images/icon.png')} style={{ width: 200, height: 200}} contentFit='contain' />
                <ActivityIndicator size='large' style={{top: 60 }} color={'white'} />
            </ThemedView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ApolloProvider client={client}>
                <ThemeProvider>
                    <KeyboardProvider statusBarTranslucent>
                        <Stack>
                            <Stack.Protected guard={!isAuth}>
                                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            </Stack.Protected>

                            <Stack.Protected guard={isAuth}>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
                                <Stack.Screen name="+not-found" />
                            </Stack.Protected>
                        </Stack>
                    </KeyboardProvider>
                </ThemeProvider>
            </ApolloProvider>
        </GestureHandlerRootView>
    );
}
