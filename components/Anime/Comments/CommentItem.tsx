import { ContextMenu } from "@/components/ContextComponent";
import { auth, db } from "@/lib/firebase";
import { CustomUser } from "@/store/userStore";
import { deleteCommentFromAnime, deleteCommentFromAnswer } from "@/utils/firebase/comments";
import { formatDate } from "@/utils/formatDate";
import { Image } from "expo-image";
import { router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { memo, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { CommentAnimeT } from "./CommentAnime.type";

interface CommentItemProps {
    comment: CommentAnimeT;
    animeID: string;
    disabled?: boolean;
    type: 'comment' | 'answer';
    mainCommentID?: string;
}

const CommentItem = memo(({ comment, animeID, disabled = false, type, mainCommentID }: CommentItemProps) => {
    const [user, setUser] = useState<CustomUser | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "user-collection", comment.user.id), (docSnap) => {
            if (docSnap.exists()) {
                setUser(docSnap.data() as CustomUser);
            }
        });

        return () => unsub();
    }, [comment.user.id]);

    const displayName = user?.displayName || comment.user.name;
    const displayPhoto = user?.avatarURL || comment.user.photoURL;

    const isOwner = comment.user.id === auth.currentUser?.uid;
    return (
        <>
            {isOwner ? (
                <ContextMenu
                    triggerItem={
                        <View style={styles.container}>
                            <Pressable onPress={() => router.push({ pathname: '/(screens)/(user)/[id]', params: { id: comment.user.id } })}>
                                <Image source={{ uri: displayPhoto }} style={styles.avatar} transition={500} />
                            </Pressable>
                            <View style={{ flex: 1, flexShrink: 1, gap: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={styles.name}>{displayName}</Text>
                                    <Text style={styles.text}>{formatDate(comment.createdAt)}</Text>
                                </View>
                                <Pressable disabled={disabled} onPress={() => router.push({ pathname: '/(screens)/(anime)/(comments)/[id]', params: { id: comment.id, animeID: animeID } })}>
                                    <Text style={styles.text} numberOfLines={6}>{comment.text}</Text>
                                </Pressable>
                            </View>
                        </View>
                    }
                    items={[
                        {
                            title: "Удалить",
                            destructive: true,
                            onSelect: () => {
                                if (type === 'answer')
                                    Alert.prompt(
                                        "Удалить комментарий?",
                                        '',
                                        [
                                            { text: 'Отмена', style: 'default' },
                                            {
                                                text: "Удалить",
                                                onPress: () => {
                                                    mainCommentID && deleteCommentFromAnswer({ animeId: Number(animeID), commentId: comment.id, mainCommentID: mainCommentID })
                                                },
                                                style: 'destructive'
                                            }
                                        ]
                                    );
                                else
                                    Alert.alert(
                                        "Удалить комментарий?",
                                        undefined,
                                        [
                                            { text: 'Отмена', style: 'default' },
                                            {
                                                text: "Удалить",
                                                onPress: () => {
                                                    deleteCommentFromAnime({ animeId: Number(animeID), commentId: comment.id })
                                                },
                                                style: 'destructive'
                                            }
                                        ]
                                    );

                            }
                        }
                    ]}
                />
            ) : (
                <View style={styles.container}>
                    <Pressable onPress={() => router.push({ pathname: '/(screens)/(user)/[id]', params: { id: comment.user.id } })}>
                        <Image source={{ uri: displayPhoto }} style={styles.avatar} transition={500} />
                    </Pressable>
                    <View style={{ flex: 1, flexShrink: 1, gap: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={styles.name}>{displayName}</Text>
                            <Text style={styles.text}>{formatDate(comment.createdAt)}</Text>
                        </View>
                        <Pressable disabled={disabled} onPress={() => router.push({ pathname: '/(screens)/(anime)/(comments)/[id]', params: { id: comment.id, animeID: animeID } })}>
                            <Text style={styles.text} numberOfLines={6}>{comment.text}</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 8,
        alignItems: "center",
        backgroundColor: 'black'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    name: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 16,
    },
    text: {
        color: "#949494ff",
        fontSize: 14
    },
});


export default CommentItem;