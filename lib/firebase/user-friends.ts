import { db } from "@/lib/firebase";
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const path = 'user-collection';

export const sendFriendRequest = async (fromUserId: string, toUserId: string) => {
    try {
        // 1. Добавляем в исходящие заявки отправителя
        await updateDoc(doc(db, path, fromUserId), {
            friendRequestsSent: arrayUnion(toUserId),
        });

        // 2. Добавляем в входящие заявки получателя
        await updateDoc(doc(db, path, toUserId), {
            friendRequestsReceived: arrayUnion(fromUserId),
        });
    } catch (err) {
        console.error("Ошибка отправки заявки:", err);
    }
};

export const acceptFriendRequest = async (currentUserId: string, requesterId: string) => {
    try {
        // 1. Удаляем из входящих/исходящих заявок
        await updateDoc(doc(db, path, currentUserId), {
            friendRequestsReceived: arrayRemove(requesterId),
            friends: arrayUnion(requesterId),
        });

        await updateDoc(doc(db, path, requesterId), {
            friendRequestsSent: arrayRemove(currentUserId),
            friends: arrayUnion(currentUserId),
        });
    } catch (err) {
        console.error("Ошибка при принятии заявки:", err);
    }
};

export const rejectFriendRequest = async (currentUserId: string, requesterId: string) => {
    try {
        await updateDoc(doc(db, path, currentUserId), {
            friendRequestsReceived: arrayRemove(requesterId),
        });

        await updateDoc(doc(db, path, requesterId), {
            friendRequestsSent: arrayRemove(currentUserId),
        });
    } catch (err) {
        console.error("Ошибка при отклонении заявки:", err);
    }
};

export const deleteFriend = async (currentUserId: string, friendId: string) => {
    try {
        await updateDoc(doc(db, path, currentUserId), {
            friends: arrayRemove(friendId),
        });

        await updateDoc(doc(db, path, friendId), {
            friends: arrayRemove(currentUserId),
        });
    } catch (err) {
        console.error("Ошибка при отклонении заявки:", err);
    }
};

export const getFriendsData = async (friendUids: string[]) => {
    if (friendUids.length === 0) return [];

    // Firestore позволяет максимум 10 элементов в `in`-запросе
    const chunkSize = 10;
    const chunks = [];

    for (let i = 0; i < friendUids.length; i += chunkSize) {
        chunks.push(friendUids.slice(i, i + chunkSize));
    }

    const results: any[] = [];

    for (const chunk of chunks) {
        const q = query(
            collection(db, path),
            where("uid", "in", chunk)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
    }

    return results;
};
