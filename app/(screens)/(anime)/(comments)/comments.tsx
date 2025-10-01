import { CommentAnimeT } from "@/components/Anime/Comments/CommentAnime.type";
import CommentItem from "@/components/Anime/Comments/CommentItem";
import WriteComment from "@/components/Anime/Comments/WriteComment";
import { auth, db } from "@/lib/firebase";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isIOS26 = Platform.Version >= '26.0';
export default function CommentScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const [commentsArr, setComments] = useState<CommentAnimeT[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        const commentsRef = collection(db, "anime", id, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comments: CommentAnimeT[] = snapshot.docs.map(doc => {
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
                        photoURL: data.user?.photoURL,
                    }
                };
            });
            setComments(comments);
            if (refresh) setRefresh(false);
        });

        return () => unsubscribe();
    }, [id, refresh]);

    const ListHeaderComponent = () => (
        <View>
            {auth.currentUser ?
                <WriteComment animeId={id} type='toAnime' />
                :
                <Text style={styles.noLogonText}>
                    Войдите в аккаунт чтобы оставлять комментарии
                </Text>
            }
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                scrollEnabled={commentsArr.length > 0}
                data={commentsArr}
                contentContainerStyle={{ paddingTop: isIOS26 ? useHeaderHeight() + 10 : 20, paddingBottom: insets.bottom, gap: 15 }}
                itemLayoutAnimation={LinearTransition.delay(200)}
                renderItem={({ item }) => (
                    <Animated.View
                        entering={FadeInDown.delay(50)}
                        exiting={FadeOutLeft.duration(300)}
                        layout={LinearTransition.springify()}
                        style={{ paddingHorizontal: 10 }}
                    >
                        <CommentItem comment={item} animeID={id as string} type="comment" />
                    </Animated.View>
                )}
                keyExtractor={item => item.id}
                ListHeaderComponent={ListHeaderComponent}
                ListHeaderComponentStyle={{ marginBottom: 10 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.noComments}>
                            Комментариев нет
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    noLogonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 40,
        paddingTop: 20,
        paddingHorizontal: 20
    },
    emptyContainer: {
        alignItems: 'center',
        height: 350,
        justifyContent: 'center'
    },
    noComments: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    }
})