import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { addCommentToAnime, addCommentToComment } from "@/lib/firebase/comments";
import { updateExp } from "@/lib/firebase/userRangUpdate";
import { useUserStore } from "@/store/userStore";
import { Button, Host } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";

const WriteComment = ({ animeId, type, commentID }: { animeId: string, type: 'toAnime' | 'toAnswer', commentID?: string }) => {
    const [commentText, setCommentText] = useState("");
    const user = useUserStore(s => s.user);
    const isDarkMode = useTheme().theme === 'dark';

    const handleWriteComment = async () => {
        if (commentText.trim().length < 1 || !user) return;
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
            <GlassView style={[{ borderRadius: 14 }, !isLiquidGlassAvailable() && { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}>
                <TextInput
                    placeholder="Введите комментарий..."
                    placeholderTextColor="gray"
                    style={[styles.commentInput, { color: isDarkMode ? 'white' : 'black' }]}
                    multiline
                    numberOfLines={6}
                    value={commentText}
                    onChangeText={setCommentText}
                    maxLength={1000}
                />
            </GlassView>

            {isLiquidGlassAvailable() ?
                <Host matchContents style={{
                    alignSelf: 'flex-end',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginTop: 10,
                    width: 120,
                    height: 25
                }}>
                    <Button modifiers={[frame({ width: 120, height: 25 })]} variant='glassProminent' role='default' onPress={handleWriteComment}>
                        Отправить
                    </Button>
                </Host>
                :
                <Pressable style={styles.sendButton} onPress={handleWriteComment}>
                    <ThemedText lightColor="white" style={styles.sendButtonText}>Отправить</ThemedText>
                </Pressable>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    commentInput: {
        padding: 16,
        borderRadius: 12,
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
        fontSize: 16,
        fontWeight: '600'
    },
})

export default WriteComment;