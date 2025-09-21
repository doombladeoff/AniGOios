import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";

/**
 * Добавляет аниме в избранное пользователя.
 * @param userId - ID пользователя
 * @param anime - объект аниме (например: {id: 123, title: "Naruto"})
 */
export const addFavoriteAnime = async (
    userId: string,
    anime: { id: number; title: string, poster: string, status: string, watched: boolean }
) => {
    try {
        const animeRef = doc(db, "user-favorites", userId, "favorites", anime.id.toString());
        const check = await isAnimeInFavorites(userId, anime.id);
        if (check) throw new Error('Anime уже в списке');

        await setDoc(animeRef, {
            id: anime.id,
            title: anime.title,
            poster: anime.poster,
            createdAt: new Date().toISOString(),
            status: anime.status,
            episodesWatched: anime.watched,
        });

        console.log(`Аниме ${anime.title} добавлено в избранное пользователя ${userId}`);

    } catch (error) {
        console.error("Ошибка при добавлении избранного:", error);
        throw error;
    }
};

/**
 * Удаляет аниме из избранного пользователя.
 * @param userId - ID пользователя
 * @param animeId - ID аниме
 */
export const removeFavoriteAnime = async (userId: string, animeId: number) => {
    const animeRef = doc(db, "user-favorites", userId, "favorites", animeId.toString());
    await deleteDoc(animeRef);
};

/**
 * Обновляет статус избранного аниме пользователя.
 * @param userId - ID пользователя
 * @param animeId - ID аниме
 * @param status - новый статус (например: "смотрю", "завершено")
 */
export const updateStatusFavoriteAnime = async (userId: string, animeId: number, status: string, watched: boolean, anime?: ShikimoriAnime) => {
    const animeRef = doc(db, "user-favorites", userId, "favorites", animeId.toString());
    try {
        await updateDoc(animeRef, {
            status,
            episodesWatched: watched
        });
    } catch (error) {
        if (!anime) return console.error("Ошибка при обновлении статуса:", error);
        await addFavoriteAnime(userId, {
            id: anime.malId as number,
            title: anime.russian,
            poster: anime.poster.mainUrl, // def main2x
            status: status,
            watched: status === 'completed' ? true : false,
        });
    }
};

/**
 * Получает все избранные аниме пользователя.
 * @param userId - ID пользователя
 * @param page - страница
 * @param pageSize - количество элементов
 * @param orderType - направление сортировкки
 * @returns Массив объектов аниме
 */
export const getFavoriteAnime = async (userId: string, page?: number, pageSize?: number, orderType?: 'desc' | 'asc', status?: "planned" | "completed" | "watching") => {
    try {
        if (!userId) return [];
        let queryConstraints: any[] = [];

        const favoritesRef = collection(db, "user-favorites", userId, "favorites");

        // фильтр по статусу
        if (status) {
            console.log(status)
            queryConstraints.push(where("status", "==", status as string));
        }

        // сортировка
        if (orderType) {
            queryConstraints.push(orderBy("createdAt", orderType));
        }

        if (page && pageSize) {
            queryConstraints.push(limit(page * pageSize));
        }

        // console.log('query', queryConstraints)
        const queryDB = query(favoritesRef, ...queryConstraints);
        const querySnapshot = await getDocs(queryDB);

        const favorites = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // пагинация (отрезаем вручную)
        if (page && pageSize) {
            const start = (page - 1) * pageSize;
            const end = page * pageSize;
            return favorites.slice(start, end);
        }

        return favorites;
    } catch (error) {
        console.error("Ошибка при получении избранного:", error);
        return [];
    }
};

/**
 * Проверяет, есть ли аниме в избранном пользователя.
 * @param userId - ID пользователя
 * @param animeId - ID аниме
 * @returns true, если аниме в избранном; иначе false
 */
export const isAnimeInFavorites = async (
    userId: string,
    animeId: string | number
): Promise<boolean> => {
    try {
        const animeRef = doc(db, "user-favorites", userId, "favorites", String(animeId));
        const docSnap = await getDoc(animeRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Ошибка при проверке избранного:", error);
        return false;
    }
};

/**
 * Получает статус аниме в избранном пользователя.
 * @param userId - ID пользователя
 * @param animeId - ID аниме
 * @returns статус аниме (например, "watching", "completed") или null, если нет в избранном
 */
export const getFavoriteAnimeStatus = async (
    userId: string,
    animeId: string | number
): Promise<string | null> => {
    try {
        const animeRef = doc(db, "user-favorites", userId, "favorites", String(animeId));
        const docSnap = await getDoc(animeRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.status ?? null; // вернёт статус, если есть
        }

        return null; // если документа нет
    } catch (error) {
        console.error("Ошибка при получении статуса избранного:", error);
        return null;
    }
};
