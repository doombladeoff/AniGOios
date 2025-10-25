import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { auth, db } from "@/lib/firebase";
import { deleteCommentFromAnime, deleteCommentFromAnswer } from "@/lib/firebase/comments";
import { CustomUser } from "@/store/userStore";
import { formatDate } from "@/utils/formatDate";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { CommentAnimeT } from "./CommentAnime.type";

interface CommentItemProps {
    comment: CommentAnimeT;
    animeID: string;
    disabled?: boolean;
    type: 'comment' | 'answer';
    mainCommentID?: string;
    answerMode?: boolean;
}

const CommentItem = memo(({ comment, animeID, disabled = false, type, mainCommentID, answerMode = false }: CommentItemProps) => {
    const [user, setUser] = useState<CustomUser | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "user-collection", comment.user.id), (docSnap) => {
            if (!docSnap.exists()) return;

            setUser(docSnap.data() as CustomUser);
        });

        return () => unsub();
    }, [comment.user.id]);

    const displayName = user?.displayName || comment.user.name;
    const displayPhoto = user?.avatarURL || comment.user.photoURL;

    const isOwner = comment.user.id === auth.currentUser?.uid;

    const handleDelete = () => {
        const title = "Удалить комментарий?";
        const message = type === "answer" ? "" : comment.text;

        const onDelete = () => {
            if (type === "answer" && mainCommentID) {
                deleteCommentFromAnswer({
                    animeId: Number(animeID),
                    commentId: comment.id,
                    mainCommentID,
                });
            } else {
                deleteCommentFromAnime({
                    animeId: Number(animeID),
                    commentId: comment.id,
                });
            }
        };

        Alert.alert(title, message, [
            { text: "Отмена", style: "default" },
            { text: "Удалить", onPress: onDelete, style: "destructive" },
        ]);
    };

    const handleNavigateUser = () => router.push({ pathname: '/(screens)/(user)/[id]', params: { id: comment.user.id } });
    const handleNavigateToComment = () => router.push({ pathname: '/(screens)/comments/[id]', params: { id: comment.id, animeID: animeID } });

    return (
        <GlassView isInteractive glassEffectStyle={'clear'} style={[styles.container, !isLiquidGlassAvailable() && { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
            <Pressable onPress={handleNavigateUser}>
                <View style={styles.avatar}>
                    <Image source={{ uri: displayPhoto }} style={styles.avatar} transition={500} />
                </View>
            </Pressable>
            <Pressable disabled={disabled} onPress={handleNavigateToComment} style={{ flex: 1 }}>
                <View style={{ flex: 1, flexShrink: 1, gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5 }}>
                            <ThemedText style={styles.name}>{displayName}</ThemedText>
                            <ThemedText style={styles.text}>{formatDate(comment.createdAt)}</ThemedText>
                        </View>
                        {isOwner && !answerMode &&
                            <Pressable hitSlop={20} onPress={handleDelete}>
                                <IconSymbol name="trash" size={20} color={'red'} />
                            </Pressable>
                        }
                    </View>
                    <ThemedText style={styles.text} numberOfLines={6}>{comment.text}</ThemedText>
                </View>
            </Pressable>
        </GlassView>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        borderRadius: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
        shadowColor: 'red',
        shadowOpacity: 0.35,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 }
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    text: {
        color: "#949494ff",
        fontSize: 14
    },
});


export default CommentItem;