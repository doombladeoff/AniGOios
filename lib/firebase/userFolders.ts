import { db } from "@/lib/firebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function createFolder(userId: string, folderName: string, folderColor?: string) {
    const userRef = doc(db, "user-collection", userId);
    await updateDoc(userRef, { folders: arrayUnion({ name: folderName, color: folderColor, anime: [] }) });
};

// export async function deleteFolder(userId: string, folderName: string) {
//     const folderRef = doc(db, "user-collection", userId, "folders", folderName);
//     await deleteDoc(folderRef);
// };

export async function deleteFolder(userId: string, folderName: string) {
    const userRef = doc(db, "user-collection", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const folders = userData.folders || [];

    const folderToRemove = folders.find((f: any) => f.name === folderName);
    if (!folderToRemove) return;

    await updateDoc(userRef, {
        folders: arrayRemove(folderToRemove)
    });
}

// export async function addAnimeToFolder(userId: string, folderId: string, animeId: number) {
//     const folderRef = doc(db, "user-collection", userId, "folders", folderId);

//     await updateDoc(folderRef, {
//         anime: arrayUnion(animeId),
//     });
// }

export async function addAnimeToFolder(userId: string, folderName: string, animeId: number) {
    const userRef = doc(db, "user-collection", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const folders = userData.folders || [];

    const updatedFolders = folders.map((folder: any) => {
        if (folder.name === folderName) {
            // Если аниме уже есть, не добавляем
            if (!folder.anime.includes(animeId)) {
                return { ...folder, anime: [...folder.anime, animeId] };
            }
        }
        return folder;
    });

    await updateDoc(userRef, { folders: updatedFolders });
}


// export async function removeAnimeFromFolder(userId: string, folderId: string, animeId: number) {
//     const folderRef = doc(db, "user-collection", userId, "folders", folderId);

//     await updateDoc(folderRef, {
//         anime: arrayRemove(animeId),
//     });
// }


export async function removeAnimeFromFolder(userId: string, folderName: string, animeId: string | string[]) {
    const userRef = doc(db, "user-collection", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const folders = userData.folders || [];

    const idsToRemove = Array.isArray(animeId)
        ? animeId.map(String)
        : [String(animeId)];

    const updatedFolders = folders.map((folder: any) => {
        if (folder.name === folderName) {
            return { ...folder, anime: folder.anime.filter((id: string) => !idsToRemove.includes(String(id))) };
        }
        return folder;
    });

    await updateDoc(userRef, { folders: updatedFolders });
}

export async function editAnimeFolder(userId: string, folderName: string, newFolderName: string, newColor: string) {
    const userRef = doc(db, "user-collection", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const folders = userData.folders || [];

    const updatedFolders = folders.map((folder: any) => {
        if (folder.name === folderName) {
            return { ...folder, name: newFolderName, color: newColor };
        }
        return folder;
    });

    await updateDoc(userRef, { folders: updatedFolders });
}

export async function getAnimesFromFavorites(userId: string, ids: number[]) {
    if (ids.length === 0) return [];

    const favoritesRef = collection(db, "user-favorites", userId, "favorites");

    // Firestore поддерживает максимум 10 значений в "in"
    const q = query(favoritesRef, where("id", "in", ids.slice(0, 10)));

    const snap = await getDocs(q);

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
