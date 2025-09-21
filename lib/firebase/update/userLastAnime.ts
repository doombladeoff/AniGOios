import { db } from "@/lib/firebase";
import { LastAnime } from "@/store/userStore";
import { collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, serverTimestamp, setDoc, startAfter, updateDoc } from "firebase/firestore";

export const UpdateLastAnime = async (userID: string, anime: LastAnime) => {
    try {
        const userRef = doc(db, "user-collection", userID);
        await updateDoc(userRef, {
            lastAnime: anime
        })
    } catch (error) {
        console.error("Ошибка при обновлении LastAnime:", error);
    }
}

export const updateAnimeHistory = async (userID: string, anime: LastAnime, editMode?: boolean) => {

    try {
        const userRef = doc(db, "user-collection", userID);

        const historyRef = doc(collection(userRef, "anime-history"), String(anime.id));

        const docSnap = await getDoc(historyRef);
        const currentData = docSnap.exists() ? docSnap.data() as LastAnime : null;

        const lastEpisode = currentData?.totalEpisodes;
        const dbWatchedEp = currentData?.watchedEpisodes ?? 0;


        if (lastEpisode && (anime.watchedEpisodes <= dbWatchedEp) && !editMode) {
            console.log(`Серия ${anime.watchedEpisodes} равна или превышает последнюю доступную. Обновление не требуется.`);
            return;
        }

        const data: LastAnime = {
            ...anime,
            createdAt: editMode && currentData?.createdAt ? currentData.createdAt : serverTimestamp(),
        };
        await setDoc(historyRef, data, { merge: true });

        console.log("Anime history обновлён!");
    } catch (error) {
        console.error("Ошибка при обновлении anime-history:", error);
    }
};

export type GetLastAnimeResult = {
    data: LastAnime[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

export const getLastAnime = async (
    userID: string,
    pageSize = 10,
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<GetLastAnimeResult> => {
    const historyRef = collection(db, "user-collection", userID, "anime-history");

    let qRef = query(historyRef, orderBy("createdAt", "desc"), limit(pageSize));

    if (startAfterDoc) {
        qRef = query(historyRef, orderBy("createdAt", "desc"), startAfter(startAfterDoc), limit(pageSize));
    }

    const querySnapshot = await getDocs(qRef);
    if (querySnapshot.empty) return { data: [], lastDoc: null };

    const docs = querySnapshot.docs.map(doc => doc.data() as LastAnime);
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { data: docs, lastDoc };
};