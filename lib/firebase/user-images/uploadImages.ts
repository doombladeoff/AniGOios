import { auth, db } from "@/lib/firebase";
import { CustomUser, useUserStore } from "@/store/userStore";
import * as ImagePicker from 'expo-image-picker';
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { updateUserAvatar, uploadAvatar } from "./changeAvatar";
import { updateUserBanner, uploadBanner } from "./changeBanner";

export const useAvatarUser = () => {
    const [image, setImage] = useState<string | null>(null);
    const [uploadingType, setUploadingType] = useState<'avatar' | 'banner' | null>(null);
    const [isLoadImage, setLoad] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const setUser = useUserStore(s => s.setUser);

    /**
     * Обрабатывает выбор изображения из библиотеки.
     * @param type - Указывает, для чего изображение: 'avatar' или 'banner'.
     */
    const pickImage = useCallback(async (type: 'avatar' | 'banner') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: type === 'avatar' ? [1, 1] : [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setUploadingType(type);
            setLoad(true);
        }
    }, []);

    useEffect(() => {
        if (image && auth.currentUser && uploadingType) {
            const currentUser = auth.currentUser as User;
            if (uploadingType === 'avatar') {
                setLoad(true)
                uploadAvatar(image, currentUser.uid, (v) => { console.log(`avatar upload: ${v}`); setProgress(v / 100); })
                    .then((url) => {
                        return updateUserAvatar(currentUser.uid, url, currentUser);
                    })
                    .catch((error) => {
                        console.error(`Failed to upload`, error);
                        setImage(null);
                        setUploadingType(null);
                    })
                    .finally(async () => {
                        setLoad(false);
                        setUploadingType(null);
                        setProgress(0);

                        if (currentUser) {
                            const userRef = doc(db, 'user-collection', currentUser.uid);
                            const userDocSnap = await getDoc(userRef);
                            let userData: any = {};
                            if (userDocSnap.exists()) {
                                userData = userDocSnap.data();
                            }
                            const combinedUser: CustomUser = { ...currentUser, ...userData };

                            setUser(combinedUser);
                        }

                    });
            } else if (uploadingType === 'banner') {
                uploadBanner(image, currentUser.uid, (v) => { console.log(`banner upload: ${v}`); setProgress(v / 100); })
                    .then((url) => {
                        return updateUserBanner(currentUser.uid, url, currentUser);
                    })
                    .catch((error) => {
                        console.error(`Failed to upload`, error);
                        setImage(null);
                        setUploadingType(null);
                    })
                    .finally(async () => {
                        setLoad(false);
                        setUploadingType(null);
                        setProgress(0);

                        if (currentUser) {
                            const userRef = doc(db, 'user-collection', currentUser.uid);
                            const userDocSnap = await getDoc(userRef);
                            let userData: any = {};
                            if (userDocSnap.exists()) {
                                userData = userDocSnap.data();
                            }
                            const combinedUser: CustomUser = { ...currentUser, ...userData };

                            setUser(combinedUser);
                        }
                    });
            }

        }
    }, [image, uploadingType]);

    return { pickImage, isLoadImage, progress }
}