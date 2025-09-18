import { CommentAnimeT } from "@/components/Anime/Comments/CommentAnime.type";
import CommentItem from "@/components/Anime/Comments/CommentItem";
import WriteComment from "@/components/Anime/Comments/WriteComment";
import { auth, db } from "@/lib/firebase";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";
export default function Comment() {
    const { id, animeID } = useLocalSearchParams();
    const [comment, setComment] = useState<CommentAnimeT | null>(null);
    const [answers, setAnswers] = useState<CommentAnimeT[]>([]);

    // Подписка на основной комментарий
    useEffect(() => {
        if (!animeID || !id) return;
        const commentRef = doc(db, 'anime', animeID.toString(), 'comments', id.toString());
        const unsubComment = onSnapshot(commentRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setComment({
                    id: snap.id,
                    createdAt: data.createdAt || "",
                    text: data.text || "",
                    user: {
                        id: data.user?.id || "",
                        name: data.user?.name || "",
                        photoURL: data.user?.photoURL || "",
                    }
                });
            }
        });
        return () => unsubComment();
    }, [animeID, id]);

    // Подписка на ответы
    useEffect(() => {
        if (!animeID || !id) return;
        const answersRef = collection(db, 'anime', animeID.toString(), 'comments', id.toString(), 'answers');
        const q = query(answersRef, orderBy('createdAt', 'desc'));
        const unsubAnswers = onSnapshot(q, (snap) => {
            const answersArr: CommentAnimeT[] = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CommentAnimeT));
            setAnswers(answersArr);
        });
        return () => unsubAnswers();
    }, [animeID, id]);

    if (!comment) return null;

    return (
        <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
            <CommentItem comment={comment} animeID={animeID as string} disabled type='comment' />
            {auth.currentUser ? (
                <WriteComment animeId={animeID as string} commentID={id as string} type='toAnswer' />
            ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center', paddingBottom: 40, paddingTop: 20 }}>Войдите в аккаунт чтобы оставлять комментарии</Text>
            )}

            {answers.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Text style={{ color: 'white' }}>Ответов нет</Text>
                </View>
            ) : (
                <Animated.FlatList
                    scrollEnabled={false}
                    data={answers}
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
                    itemLayoutAnimation={LinearTransition.delay(200)}
                    renderItem={({ item }) => (
                        <Animated.View
                            entering={FadeInDown.delay(50)}
                            exiting={FadeOutLeft.duration(300)}
                            layout={LinearTransition.springify()}
                        >
                            <CommentItem key={item.id} comment={item} animeID={animeID as string} disabled type="answer" mainCommentID={comment.id} />
                        </Animated.View>
                    )}
                    keyExtractor={item => item.id}
                />
            )}
        </ScrollView>
    );
}
