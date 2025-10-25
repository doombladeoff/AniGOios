import { useTheme } from "@/hooks/ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { ImageStyle } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { ThemedText } from "../ui/ThemedText";
import { CardPoster } from "./Item/CardPoster";
import { ListHeader } from "./ListHeader";

interface LatestUpdatesProps {
    updates: any[];
    showHeader?: boolean;
    headerTextStyle?: StyleProp<TextStyle>;
    containerStye?: StyleProp<ViewStyle>;
    imageContainer?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    imageTextTitle?: StyleProp<TextStyle>;
    imageTextVoice?: StyleProp<TextStyle>;
    episodeTextStyle?: StyleProp<TextStyle>;
}

const LatestUpdates = (props: LatestUpdatesProps) => {
    const isDarkMode = useTheme().theme === 'dark';

    if (!props.updates || props.updates.length < 1) return null;

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const handeNavigate = () => router.push({
            pathname: '/(screens)/(anime)/[id]',
            params: { id: item.shikimori_id }
        });

        return (
            <Animated.View entering={index < 4 ? FadeInLeft.delay(100 * (index)).duration(750) : undefined}>
                <CardPoster
                    index={index}
                    img={item?.poster?.originalUrl}
                    imgStyle={props.imageStyle}
                    container={props.imageContainer}
                    transition={700}
                    imgPriority={'high'}
                    onPress={handeNavigate}
                >
                    <ThemedText lightColor="white" style={props.episodeTextStyle} numberOfLines={2}>Серия {item.last_episode}</ThemedText>
                    <ThemedText style={props.imageTextTitle} numberOfLines={2}>{item.title}</ThemedText>
                    <ThemedText style={props.imageTextVoice} numberOfLines={2}>{item.translation.title}</ThemedText>
                </CardPoster>
            </Animated.View>
        )
    };

    return (
        <View>
            <ListHeader
                text="Последние обновления"
                textStyle={props.headerTextStyle}
                iconName="arrow.right"
                iconColor={isDarkMode ? 'white' : 'black'}
                iconSize={22}
                containerStyle={{
                    paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                }}
                onPress={() => router.push({ pathname: '/anime/lastUpdates' })}
            />

            <FlashList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={props.updates}
                contentContainerStyle={props.containerStye}
                keyExtractor={(item) => `t-${item.translation.id}-shiki-${item.shikimori_id}-${item.title}`}
                renderItem={renderItem}
            />
        </View>
    )
};

export default memo(LatestUpdates);