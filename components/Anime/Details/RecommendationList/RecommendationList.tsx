import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { Image, ImageStyle } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

interface RecommendationListProps {
    id: number;
    showTitle?: boolean;
    titleStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle: StyleProp<ImageStyle>;
    imageTextStyle?: StyleProp<TextStyle>;

}

const RecommendationList = (props: RecommendationListProps) => {
    const recommendations = useAnimeStore(s => s.animeMap[props.id].recommendations);
    if (!recommendations || recommendations.length < 1) return null;

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            onPress={() => {
                const id = item?.entry?.mal_id || item?.remote_ids?.shikimori_id;
                router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: id } })
            }}
            style={{ marginHorizontal: 5 }}
        >
            <Image
                source={{ uri: item?.entry?.images.webp.large_image_url || `https:${item.poster.fullsize}` }}
                style={props.imageStyle}
                transition={500}
            />
            <Text style={props.imageTextStyle} numberOfLines={2}>{item?.entry?.title || item.title}</Text>
        </Pressable>
    );

    return (
        <View>
            {console.log('redner Recommends')}
            {props.showTitle && <Text style={props.titleStyle}>Рекомендации</Text>}
            <FlashList
                data={recommendations}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={props.containerStyle}
                renderItem={renderItem}
            />
        </View>
    )
};

export default memo(RecommendationList)