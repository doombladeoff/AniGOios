import { auth, db } from '@/lib/firebase';
import { addUser } from '@/lib/firebase/addUser';
import { useUserStore } from '@/store/userStore';
import { makeRedirectUri } from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect } from 'react';

export const useGoogleAuth = () => {
    const setUser = useUserStore(s => s.setUser);
    const router = useRouter();

    const [request, response, promptAsync] = useAuthRequest({
        selectAccount: true,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        redirectUri: makeRedirectUri({ scheme: 'com.f0rever.anigo' }),
    });

    const handleAuthSuccess = useCallback(
        async (user: any, userData: any = {}) => {
            try {
                const userDocRef = doc(db, "user-collection", user.uid);
                let userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    await addUser(user);
                    userDoc = await getDoc(userDocRef);
                }

                const tokenDocRef = doc(db, 'yummy-tokens', 'tokenData');
                let tokenDoc = await getDoc(tokenDocRef);

                let yummyToken = '';
                let yummyTokenDate = new Date(0);

                if (!tokenDoc.exists()) {
                    // await YummyAPI.auth.login();
                    tokenDoc = await getDoc(tokenDocRef);

                    if (tokenDoc.exists()) {
                        const tokenData = tokenDoc.data();
                        yummyToken = tokenData.token;
                        yummyTokenDate = new Date(tokenData.date);
                    }
                } else {
                    const tokenData = tokenDoc.data();
                    yummyToken = tokenData.token;
                    yummyTokenDate = new Date(tokenData.date);
                }

                const fullUserData = {
                    ...user,
                    ...userDoc.data(),
                    yummyToken,
                    yummyTokenDate,
                };

                setUser(fullUserData);

                router.replace('/(tabs)/(home)');
            } catch (error) {
                console.error("Failed to handle auth success:", error);
            }
        },
        [router, setUser]
    );

    const authenticateUser = useCallback(async (user: any, userData: any = {}) => {
        try {
            await handleAuthSuccess(user, userData);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    }, [handleAuthSuccess]);

    const loginToFirebase = useCallback(async (credentials: any) => {
        const { user } = await signInWithCredential(auth, credentials);
        await authenticateUser(user);
    }, [authenticateUser]);


    const login = useCallback(async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            await authenticateUser(user);
        } catch (error: any) {
            console.error("Login failed:", error.code);
            throw error;
        }
    }, [authenticateUser]);

    const register = useCallback(async (username: string, email: string, password: string) => {
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = credentials;
            await updateProfile(user, { displayName: username });
            const userData = { displayName: username };
            await handleAuthSuccess(user, userData);
        } catch (error: any) {
            console.error("Registration failed:", error);
            throw error;
        }
    }, [handleAuthSuccess]);


    useEffect(() => {
        if (response?.type === 'success') {
            const credentials = GoogleAuthProvider.credential(response.params.id_token);
            loginToFirebase(credentials);
        }
    }, [response, loginToFirebase]);



    return { request, promptAsync, login, register };
};