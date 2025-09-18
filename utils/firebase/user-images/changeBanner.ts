import { db, FIREBASE_STORAGE } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const uploadBanner = async (uri: string, userId: string, onProgress?: (progress: number) => void) => {
    const userDocRef = doc(db, 'user-collection', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const oldBannerURL = userData.bannerURL;

        if (oldBannerURL) {
            const oldBannerPath = decodeURIComponent(oldBannerURL.split('/o/')[1].split('?')[0]);
            const oldAvatarRef = ref(FIREBASE_STORAGE, oldBannerPath);

            try {
                await deleteObject(oldAvatarRef);
            } catch (error) {
                console.warn("Не удалось удалить предыдущий баннер:", error);

                const filename = uri.split('/').pop();
                const avatarRef = ref(FIREBASE_STORAGE, `banners/${userId}/${filename}`);
                const response = await fetch(uri);
                const blob = await response.blob();
                // await uploadBytes(avatarRef, blob);
                // return getDownloadURL(avatarRef);

                return new Promise<string>((resolve, reject) => {
                    const uploadTask = uploadBytesResumable(avatarRef, blob);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes); //*100 0-100
                            if (onProgress) onProgress(progress);
                        },
                        (error) => reject(error),
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }
        }
    }

    const filename = uri.split('/').pop();
    const avatarRef = ref(FIREBASE_STORAGE, `banners/${userId}/${filename}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    // await uploadBytes(avatarRef, blob);
    // return getDownloadURL(avatarRef);

    return new Promise<string>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(avatarRef, blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes); //*100 0-100
                if (onProgress) onProgress(progress);
            },
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
            }
        );
    });
};

export const updateUserBanner = async (userId: string, bannetUrl: string, user: any) => {
    const userRef = doc(db, 'user-collection', userId);
    await setDoc(userRef, { bannerURL: bannetUrl, lastLoginAt: serverTimestamp() }, { merge: true });
};