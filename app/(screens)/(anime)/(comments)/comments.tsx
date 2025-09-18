import { CommentAnimeT } from "@/components/Anime/Comments/CommentAnime.type";
import CommentItem from "@/components/Anime/Comments/CommentItem";
import WriteComment from "@/components/Anime/Comments/WriteComment";
import { auth, db } from "@/lib/firebase";
import { useLocalSearchParams } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommentScreen() {
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [commentsArr, setComments] = useState<CommentAnimeT[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const commentsRef = collection(db, "anime", id as string, "comments");
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
            if (loading) setLoading(false);
            if (refresh) setRefresh(false);
        });

        return () => unsubscribe();
    }, [id, refresh]);


    if (loading) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'small'} color={'white'} />
        </View>
    );


    const ListHeaderComponent = () => {
        return (
            <View>
                {auth.currentUser ?
                    <WriteComment animeId={id as string} type='toAnime' />
                    :
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center', paddingBottom: 40, paddingTop: 20 }}>Войдите в аккаунт чтобы оставлять комментарии</Text>
                }
            </View>
        )
    }

    return (
        <>
            <Animated.FlatList
                data={commentsArr}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom }}
                itemLayoutAnimation={LinearTransition.delay(200)}
                renderItem={({ item }) => (
                    <Animated.View
                        entering={FadeInDown.delay(50)}
                        exiting={FadeOutLeft.duration(300)}
                        layout={LinearTransition.springify()}
                    >
                        <CommentItem comment={item} animeID={id as string} type="comment" />
                    </Animated.View>
                )}
                keyExtractor={item => item.id}
                ListHeaderComponent={ListHeaderComponent}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => setRefresh(true)}
                    />
                }
                ListFooterComponent={
                    <>
                        {commentsArr.length < 1 && (<Text style={{ color: 'white' }}>Комментариев нет</Text>)}
                    </>
                }
                ListFooterComponentStyle={{ alignItems: 'center', height: 200, justifyContent: 'center' }}
            />
        </>
    );
}
