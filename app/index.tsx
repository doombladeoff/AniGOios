import { auth, db } from "@/lib/firebase";
import { CustomUser, useUserStore } from "@/store/userStore";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef } from "react";

export default function StartScreen() {
    const isSkip = storage.getSkip();
    const redirected = useRef(false);
    const setUser = useUserStore(s => s.setUser);

    useEffect(() => {
        if (redirected.current) return;

        if (isSkip) {
            redirected.current = true;
            router.replace("/(tabs)/(home)/home");
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (redirected.current) return;

            if (!user) {
                setUser(null);
                router.replace("/(auth)");
                return;
            }

            if (!redirected.current) {
                redirected.current = true;
                router.replace("/(tabs)/(home)/home");
            }

            // Подписка на документ пользователя
            const userDocRef = doc(db, "user-collection", user.uid);
            const unsubscribeSnapshot = onSnapshot(userDocRef, (snap) => {
                if (!snap.exists()) {
                    // Создаем дефолтного пользователя если нет
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
                } else {
                    const userData = snap.data() as Omit<CustomUser, keyof User>;
                    const combinedUser: CustomUser = { ...user, ...userData };
                    setUser(combinedUser);
                }

            });

            return () => {
                unsubscribeSnapshot();
            };
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    return null;
}
