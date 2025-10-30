import { auth, db } from "@/lib/firebase";
import { CustomUser } from "@/store/userStore";
import { arrayRemove, arrayUnion, collection, doc, endAt, getDoc, getDocs, orderBy, query, startAt, updateDoc, where } from "firebase/firestore";

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

export const getFriendRequests = async (userId: string) => {
    try {
        const userDoc = await getDoc(doc(db, path, userId));
        if (!userDoc.exists()) return null;

        const data = userDoc.data();
        return {
            received: data.friendRequestsReceived || [],
            sent: data.friendRequestsSent || [],
            friends: data.friends || []
        };
    } catch (err) {
        console.error("Ошибка при получении заявок:", err);
        return null;
    }
};

export const searchUsersByName = async (searchText: string, limitCount = 10): Promise<CustomUser[]> => {
    if (!searchText.trim())
        return [];
    const usersRef = collection(db, "user-collection");
    const q = query(usersRef, orderBy("displayName"), startAt(searchText), endAt(searchText + "\uf8ff"));
    const snapshot = await getDocs(q);

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as CustomUser) }))
        .filter(user => user.id !== auth.currentUser?.uid)
        .slice(0, limitCount);
}