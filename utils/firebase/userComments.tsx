import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";

const formatDate = (date: Date) => date.toLocaleDateString("ru-RU");

export type Comment = {
    id: string;
    uid: string;
    avatar: string;
    name?: string;
    text: string;
    date: string;
    createdAt: any; // serverTimestamp
};

export async function addComment(fromID: { uid: string; avatar: string; name: string }, toID: string, text: string) {
    const commentsRef = collection(db, "user-collection", toID, "comments");

    await addDoc(commentsRef, {
        uid: fromID.uid,
        avatar: fromID.avatar,
        name: fromID.name,
        text,
        date: formatDate(new Date()),
        createdAt: serverTimestamp(),
    });
};

export async function getComments(userID: string, pageSize = 10,) {
    const commentsRef = collection(db, "user-collection", userID, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"), limit(pageSize));
    const snapshot = await getDocs(q);
    const comments: Comment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
    }));

    return comments;
};

/**
 * Удаляет комментарий пользователя
 * @param userId - ID пользователя, которому принадлежит комментарий
 * @param commentId - ID комментария, который нужно удалить
 */
export async function deleteComment(userId: string, commentId: string) {
    try {
        const commentRef = doc(db, "user-collection", userId, "comments", commentId);
        await deleteDoc(commentRef);
        console.log("Комментарий удалён");
    } catch (error) {
        console.error("Ошибка при удалении комментария:", error);
    }
}