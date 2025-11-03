import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export const addUser = async (user: any) => {
    const userRef = doc(db, "user-collection", user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp(),
        });
    } else {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLoginAt: serverTimestamp(),
            friends: [],
            folders: [],
            rang: {
                level: 1,
                exp: 0,
            },
            watchStats: {
                watchTime: 0,
                watchedEpisodes: 0,
            },
            status: '',
        });
    }
};
