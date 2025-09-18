import { db, FIREBASE_STORAGE } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const uploadAvatar = async (uri: string, userId: string, onProgress?: (progress: number) => void) => {
    const userDocRef = doc(db, 'user-collection', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const oldAvatarURL = userData.avatarURL;

        if (oldAvatarURL) {
            const oldAvatarPath = decodeURIComponent(oldAvatarURL.split('/o/')[1].split('?')[0]);
            const oldAvatarRef = ref(FIREBASE_STORAGE, oldAvatarPath);

            try {
                await deleteObject(oldAvatarRef);
            } catch (error) {
                console.warn("Не удалось удалить предыдущую аватарку:", error);
            }
        }
    }

    const filename = uri.split('/').pop();
    const avatarRef = ref(FIREBASE_STORAGE, `avatars/${userId}/${filename}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    // await uploadBytes(avatarRef, blob);
    // return getDownloadURL(avatarRef);
    // загружаем с прогрессом
    return new Promise<string>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(avatarRef, blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes); //*100 0-100
                if (onProgress) onProgress(progress); // <- сюда прогресс
            },
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
            }
        );
    });
};


export const updateUserAvatar = async (userId: string, avatarUrl: string, user: any) => {
    const userRef = doc(db, 'user-collection', userId);
    await setDoc(userRef, { avatarURL: avatarUrl, lastLoginAt: serverTimestamp() }, { merge: true });
    if (user) {
        await updateProfile(user, { photoURL: avatarUrl });

        // const userDocSnap = await getDoc(userRef);
        // let userData: any = {};
        // if (userDocSnap.exists()) {
        //     userData = userDocSnap.data();
        // }
        // const combinedUser: CustomUser = { ...user, ...userData };

        // setUser(combinedUser);
    }
};