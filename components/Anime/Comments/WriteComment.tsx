import { useUserStore } from "@/store/userStore";
import { addCommentToAnime, addCommentToComment } from "@/utils/firebase/comments";
import { updateExp } from "@/utils/firebase/userRangUpdate";
import { useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";

const WriteComment = ({ animeId, type, commentID }: { animeId: string, type: 'toAnime' | 'toAnswer', commentID?: string }) => {
    const [commentText, setCommentText] = useState("");
    const user = useUserStore(s => s.user);

    const handleWriteComment = async () => {
        if (commentText.trim().length < 1) return;
        if (!user) return;
        const photo = user.avatarURL || user.photoURL || '';
        switch (type) {
            case 'toAnime':
                try {
                    await addCommentToAnime({
                        animeId: animeId,
                        text: commentText,
                        user: {
                            id: user.uid,
                            photoURL: photo,
                            name: user.displayName || '',
                        }
                    }).then(() => {
                        updateExp(user.uid, 2);
                    })
                } catch (error) {
                    console.error(error)
                }
            case 'toAnswer':
                try {
                    await addCommentToComment({
                        animeId: animeId,
                        text: commentText,
                        user: {
                            id: user.uid,
                            photoURL: photo,
                            name: user.displayName || '',
                        },
                        commentID: commentID || ''
                    }).then(() => {
                        updateExp(user.uid, 2);
                    })
                } catch (error) {
                    console.error(error)
                }
        }
        setCommentText('');
        Keyboard.dismiss();
    };

    return (
        <View style={{ minHeight: 120, gap: 10, marginHorizontal: 10 }}>
            <TextInput
                placeholder="Введите комментарий..."
                placeholderTextColor="gray"
                style={styles.commentInput}
                multiline
                numberOfLines={6}
                value={commentText}
                onChangeText={setCommentText}
            />

            <Pressable style={styles.sendButton} onPress={handleWriteComment}>
                <Text style={styles.sendButtonText}>Отправить</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    commentInput: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        color: 'white',
        fontSize: 16,
        minHeight: 120
    },
    sendButton: {
        backgroundColor: '#0A84FF',
        alignSelf: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 10
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
})

export default WriteComment;