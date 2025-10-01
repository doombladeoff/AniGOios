import { CommentAnimeT } from "@/components/Anime/Comments/CommentAnime.type";
import CommentItem from "@/components/Anime/Comments/CommentItem";
import WriteComment from "@/components/Anime/Comments/WriteComment";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { auth, db } from "@/lib/firebase";
import { deleteCommentFromAnime } from "@/lib/firebase/comments";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";

const mapComment = (snap: any): CommentAnimeT => ({
    id: snap.id,
    createdAt: snap.data().createdAt || "",
    text: snap.data().text || "",
    user: {
        id: snap.data().user?.id || "",
        name: snap.data().user?.name || "",
        photoURL: snap.data().user?.photoURL || "",
    },
});

const mapAnswer = (doc: any): CommentAnimeT => ({
    id: doc.id,
    ...doc.data(),
} as CommentAnimeT);

export default function Comment() {
    const { id, animeID } = useLocalSearchParams();

    const headerHeight = useHeaderHeight();

    const [comment, setComment] = useState<CommentAnimeT | null>(null);
    const [answers, setAnswers] = useState<CommentAnimeT[]>([]);

    useEffect(() => {
        if (!animeID || !id) return;

        const commentRef = doc(db, 'anime', animeID.toString(), 'comments', id.toString());
        const unsubComment = onSnapshot(commentRef, (snap) => {
            if (snap.exists())
                setComment(mapComment(snap));
        });

        const answersRef = collection(db, "anime", animeID.toString(), "comments", id.toString(), "answers");
        const q = query(answersRef, orderBy("createdAt", "desc"));
        const unsubAnswers = onSnapshot(q, (snap) => {
            setAnswers(snap.docs.map(mapAnswer));
        });

        return () => {
            unsubComment();
            unsubAnswers();
        };
    }, [animeID, id]);

    const handleDelete = useCallback(() => {
        if (!comment) return;
        Alert.alert("Удалить комментарий?", undefined, [
            { text: "Отмена" },
            {
                text: "Удалить",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteCommentFromAnime({ animeId: Number(animeID), commentId: comment.id });
                        router.back();
                    } catch (err) {
                        console.error("Ошибка в удалении комментария:", err);
                    }
                },
            },
        ]);
    }, [comment, animeID]);

    if (!comment) return null;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    ...(auth.currentUser?.uid === comment.user.id && {
                        headerRight: () => (
                            <Pressable onPress={handleDelete} style={styles.trashBtn}>
                                <IconSymbol name="trash" size={22} color="red" />
                            </Pressable>
                        ),
                    }),
                }}
            />

            <ScrollView contentContainerStyle={{ paddingTop: headerHeight + 10, gap: 10 }}>
                <View style={styles.commentBlock}>
                    <CommentItem comment={comment} animeID={animeID as string} disabled type="comment" answerMode />
                </View>

                {auth.currentUser ? (
                    <WriteComment animeId={animeID as string} commentID={id as string} type="toAnswer" />
                ) : (
                    <Text style={styles.loginText}>Войдите в аккаунт чтобы оставлять комментарии</Text>
                )}

                {answers.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={{ color: "white" }}>Ответов нет</Text>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={answers}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingVertical: 20 }}
                        itemLayoutAnimation={LinearTransition.delay(200)}
                        renderItem={({ item }) => (
                            <Animated.View
                                entering={FadeInDown.delay(50)}
                                exiting={FadeOutLeft.duration(300)}
                                layout={LinearTransition.springify()}
                                style={{ paddingHorizontal: 10 }}
                            >
                                <CommentItem comment={item} animeID={animeID as string} disabled type="answer" mainCommentID={comment.id} />
                            </Animated.View>
                        )}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={<Text style={styles.answersTitle}>Ответы</Text>}
                        ListHeaderComponentStyle={{ marginBottom: 10 }}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    trashBtn: {
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35
    },
    commentBlock: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 200
    },
    answersTitle: {
        color: "white",
        fontSize: 22,
        fontWeight: "600",
        paddingHorizontal: 20,
        marginTop: 10
    },
});