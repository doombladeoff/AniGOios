import { Comments, Level, Stats } from "@/components/Screens/Profile";
import { Header } from "@/components/Screens/Profile/Header";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { auth, db } from "@/lib/firebase";
import { CustomUser, useUserStore } from "@/store/userStore";
import { addComment, Comment, getComments } from "@/utils/firebase/userComments";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { RefreshControl, TextInput } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { id: userID } = useLocalSearchParams();
    const authUser = useUserStore(s => s.user);

    const [user, setUser] = useState<CustomUser | null>(null);
    const [commentText, setCommentText] = useState("");
    const [commentsArr, setCommentsArr] = useState<Comment[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [refresh, setRefresh] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    /** Загрузка данных пользователя */
    const fetchUser = useCallback(async () => {
        if (!userID) return;
        try {
            const userRef = doc(db, "user-collection", String(userID));
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUser({ id: userSnap.id, ...(userSnap.data() as CustomUser) });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    }, [userID]);

    /** Загрузка комментариев */
    const fetchComments = useCallback(async (isRefresh = false) => {
        if (!userID) return;
        try {
            if (isRefresh) setLastDoc(null);
            const comments = await getComments(
                userID as string,
                10,

            );
            setCommentsArr(prev => (isRefresh ? comments : [...prev, ...comments]));
            // setLastDoc(newLastDoc);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }, [userID, lastDoc]);


    useEffect(() => {
        if (!userID) return;
        const userDocRef = doc(db, "user-collection", userID as string);
        const commentsRef = collection(userDocRef, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comments: Comment[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Comment, "id">),
            }));
            setCommentsArr(comments);
        });

        return () => unsubscribe();
    }, [userID]);

    /** Добавление комментария */
    const handleAddComment = async () => {
        if (!authUser || !commentText.trim()) return;
        Keyboard.dismiss();
        try {
            await addComment(
                { uid: authUser.uid, avatar: authUser.avatarURL, name: authUser.displayName || '' },
                userID as string,
                commentText.trim(),
            );
            setCommentText("");
            fetchComments(true);
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    /** Scroll animation */
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const avatarAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [0, 100], [1, 0.5], Extrapolation.CLAMP);
        const translateX = interpolate(scrollY.value, [0, 100], [0, -width + 150], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [0, 100], [0, -40], Extrapolation.CLAMP);
        return { transform: [{ scale }, { translateX }, { translateY }] };
    });

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [40, 100], [0, 1], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [40, 100], [20, 0], Extrapolation.CLAMP);
        return { opacity, transform: [{ translateY }] };
    });

    useEffect(() => { fetchUser(); fetchComments(true); }, [fetchUser, fetchComments]);

    if (!user) return null;

    return (
        <>
            <Stack.Screen options={{
                header: () => (
                    <View style={styles.headerContainer}>
                        <Header
                            useContext={false}
                            bannerStyle={styles.banner}
                            bannerUrl={user.bannerURL}
                            avatarContainer={[avatarAnimatedStyle, styles.avatarContainer]}
                            avatarStyle={styles.avatar}
                            avatarUrl={user.avatarURL || user.photoURL || ''}
                            showEditPencil={false}
                        />
                        <Animated.Text style={[textStyle, styles.username]}>{user.displayName}</Animated.Text>
                        <Pressable onPress={router.back} style={{ position: 'absolute', left: 15, top: insets.top, zIndex: 1 }}>
                            <IconSymbol name={'arrow.left'} size={24} color="white" />
                        </Pressable>
                    </View>
                )
            }} />
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        progressViewOffset={180}
                        onRefresh={async () => { setRefresh(true); await fetchComments(true); setRefresh(false); }}
                    />
                }
            >
                <View style={styles.mainContent}>
                    <Stats userID={userID as string} friends={user.friends.length} />
                    <Level />

                    {auth.currentUser ? (
                        <>
                            <TextInput
                                placeholder="Введите комментарий..."
                                placeholderTextColor="gray"
                                style={styles.commentInput}
                                multiline
                                numberOfLines={6}
                                value={commentText}
                                onChangeText={setCommentText}
                            />

                            <Pressable style={styles.sendButton} onPress={handleAddComment}>
                                <Text style={styles.sendButtonText}>Отправить</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center', paddingBottom: 40, paddingTop: 20 }}>Войдите в аккаунт чтобы оставлять комментарии</Text>

                    )}


                    <Comments comments={commentsArr} userID={userID as string} />
                </View>
            </Animated.ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 0,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 }
    },
    banner: {
        width: '100%',
        height: 140,
        borderRadius: 14,
        backgroundColor: 'black'
    },
    avatarContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 120 / 1.75,
        backgroundColor: 'black',
        padding: 8,
        borderRadius: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 14,
        padding: 0,
        backgroundColor: 'black'
    },
    username: {
        color: 'white',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 25,
        fontSize: 21,
        fontWeight: '600'
    },
    scrollContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 140,
        paddingBottom: 100
    },
    mainContent: {
        marginTop: 40,
        gap: 12
    },
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
});
