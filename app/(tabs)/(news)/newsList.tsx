import { getNews } from "@/API/Shikimori/getNews";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";

export default function NewsListScreen() {
    // const bottomTabHeight = useBottomTabBarHeight()
    const [newsData, setNewsData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const firstRender = useRef(true);
    const [isLoad, setIsLoad] = useState(false);

    const fetch = async () => {
        if (page !== 1) setIsLoad(true);
        try {
            const response = await getNews(10, page);
            const data = response.slice(0, response.length - 1);
            if (response) {
                if (page === 1)
                    setNewsData(data);
                else
                    setNewsData(prev => [...prev, ...data])
            }
        } catch (error) {
            //
        } finally {
            setIsLoad(false)
        }

    }

    useEffect(() => {
        fetch().then(() => firstRender.current = false);
    }, [page])
    return (
        <FlatList
            data={newsData}
            contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 15,
                //  paddingBottom: bottomTabHeight + 15,
                  gap: 10 }}
            renderItem={({ item, index }) => {
                let match = item?.html_footer.match(/<img[^>]+src="([^"]+)"/);
                let url = match?.[1];

                // Если нет src, то берем href
                if (!url) {
                    match = item?.html_footer.match(/<a[^>]+href="([^"]+)"/);
                    url = match?.[1];
                }

                if (url && !/^https?:\/\//i.test(url)) {
                    url = `https:${url}`;
                }
                return (
                    <View>
                        {/* Фоновая картинка с абсолютным позиционированием */}
                        <Image
                            source={{ uri: url }}
                            style={{ width: '100%', height: 240, borderRadius: 12, zIndex: 1 }}
                            contentPosition={'center'}
                            blurRadius={0}
                        />

                        {/* Блюр и контент поверх */}
                        <BlurView
                            style={[StyleSheet.absoluteFillObject, { position: 'absolute', width: '100%', height: 240, zIndex: 10, borderRadius: 12, overflow: 'hidden' }]}
                            tint="systemChromeMaterial"
                            intensity={70}
                        >
                            <Pressable
                                onPress={() => router.push({ pathname: '/(tabs)/(news)/news', params: { id: item.id } })}
                                style={{ flex: 1, padding: 10, gap: 10 }}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={{ width: '100%', height: 140, borderRadius: 12 }}
                                    contentPosition={'center'}
                                />

                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                    {item.topic_title}
                                </Text>
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </Text>
                            </Pressable>
                        </BlurView>
                    </View>
                )
            }}
            ListFooterComponent={
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {isLoad &&
                        <ActivityIndicator size={'small'} color={'white'} />
                    }
                </View>
            }
            keyExtractor={(item, index) => `news-${item.id}`}
            onEndReachedThreshold={1}
            onEndReached={() => { if (firstRender.current) return; setPage(prev => prev + 1) }}
        />
    )
}