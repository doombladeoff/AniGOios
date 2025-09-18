import { db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    setDoc,
    startAfter,
} from "firebase/firestore";

const COMMENTS_LIMIT = 10;

const getCommentsRef = (animeId: string) =>
    collection(db, "anime", animeId, "comments");

const getCommentDocRef = (animeId: string, commentId: string) =>
    doc(db, "anime", animeId, "comments", commentId);

const getLikeDocRef = (animeId: string, commentId: string, userId: string) =>
    doc(db, "anime", animeId, "comments", commentId, "likes", userId);


export const fetchComments = async ({ animeId, lastDoc = null, }: {
    animeId: string;
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}) => {
    const ref = getCommentsRef(animeId);
    const q = query(
        ref,
        orderBy("createdAt", "desc"),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(COMMENTS_LIMIT)
    );

    const snapshot = await getDocs(q);
    return {
        comments: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        lastVisible: snapshot.docs.at(-1) || null,
        hasMore: snapshot.docs.length === COMMENTS_LIMIT,
    };
};


interface AddComment {
    animeId: number | string;
    text: string;
    user: {
        id: string;
        name: string;
        photoURL: string;
    };
}
export const addCommentToAnime = async ({ animeId, text, user }: AddComment) => {
    try {
        const ref = getCommentsRef(animeId.toString());
        const docRef = await addDoc(ref, {
            text,
            createdAt: serverTimestamp(),
            user,
        });
        return docRef.id;
    } catch (error) {
        console.error(error);
    }

};

interface AnswerComment extends AddComment {
    commentID: string
}
export const addCommentToComment = async ({ animeId, text, user, commentID, }: AnswerComment) => {
    try {
        if (!commentID) return new Error('Не указан id комментария');
        const answerRef = collection(db, 'anime', animeId.toString(), 'comments', commentID, 'answers');
        const docRef = await addDoc(answerRef, {
            text,
            createdAt: serverTimestamp(),
            user
        });
        return docRef.id;
    } catch (error) {
        console.log(error);
    }
};


export const deleteCommentFromAnime = async ({ animeId, commentId }: { animeId: number; commentId: string; }) => {
    try {
        await deleteDoc(getCommentDocRef(animeId.toString(), commentId));
    } catch (error) {
        console.error(error);
    }
};

export const deleteCommentFromAnswer = async ({ animeId, commentId, mainCommentID }: { animeId: number; commentId: string; mainCommentID: string }) => {
    console.log(animeId, commentId, mainCommentID)
    try {
        const answerRef = doc(db, 'anime', animeId.toString(), 'comments', mainCommentID, 'answers', commentId);
        await deleteDoc(answerRef);
    } catch (error) {
        console.log(error)
    }

};


export const toggleLikeComment = async ({ animeId, commentId, userId, liked }: {
    animeId: string;
    commentId: string;
    userId: string;
    liked: boolean;
}) => {
    const likeRef = getLikeDocRef(animeId, commentId, userId);
    liked ? await deleteDoc(likeRef) : await setDoc(likeRef, { createdAt: new Date() });
};


export const checkIfUserLiked = async ({ animeId, commentId, userId }: {
    animeId: string;
    commentId: string;
    userId: string;
}) => {
    const likeSnap = await getDoc(getLikeDocRef(animeId, commentId, userId));
    return likeSnap.exists();
};

export const getLikesCount = async ({ animeId, commentId }: { animeId: string; commentId: string; }) => {
    const likesSnap = await getDocs(
        collection(db, "anime", animeId, "comments", commentId, "likes")
    );
    return likesSnap.size;
};
