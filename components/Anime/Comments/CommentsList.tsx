import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import CommentItem from "./CommentItem";

const fetchComments = async () => {
    const commentsRef = collection(db, "anime", `${52991}`, "comments");
    const snap = await getDocs(commentsRef);

    const comments: CommentAnime[] = snap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            createdAt: data.createdAt,
            rating: data.rating,
            text: data.text,
            titleText: data.titleText,
            user: {
                id: data.user?.id,
                name: data.user?.name,
                photoUrl: data.user?.photoUrl,
            }
        };
    });

    return comments;
};

type CommentAnime = {
    id: string;
    createdAt: string;
    // rating: number;
    text: string;
    // titleText: string;
    user: {
        id: string;
        name: string;
        photoUrl: string;
    }
}


export const CommentsList = () => {
    const [commetnsArr, setComments] = useState<CommentAnime[]>([])


    useEffect(() => {
        fetchComments().then((r) => setComments(r))
    }, []);

    return (
        <FlatList
            scrollEnabled={false}
            data={commetnsArr}
            renderItem={({ item }) => (<CommentItem comment={item} />)}
            keyExtractor={item => item.id}
        />
    )
}