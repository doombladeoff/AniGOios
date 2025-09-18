import { Screenshot } from "@/API/Shikimori/Shikimori.types";
import { ContextMenu } from "@/components/ContextComponent";
import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { Image, ImageStyle } from "expo-image";
import { memo } from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { useShallow } from "zustand/shallow";

interface ScreenshotsListProps {
    id: string | number;
    screenshots?: Screenshot[];
    useContextMenu: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle: StyleProp<ImageStyle>;
    imageStylePreview?: StyleProp<ImageStyle>;
    headerText?: string;
    headerTextStyle?: StyleProp<TextStyle>;
}

const ScreenshotsList = (props: ScreenshotsListProps) => {
    const screenshots = useAnimeStore(useShallow(s => s.animeMap[props.id as number].screenshots.slice(0, 10)))
    if (!screenshots || screenshots.length < 1) return null;

    const renderItem = ({ item }: { item: Screenshot }) => (
        <View>
            {props.useContextMenu ? (
                <ContextMenu
                    triggerItem={<Image source={{ uri: item.x332Url }} style={props.imageStyle} contentFit='cover' transition={500} />}
                    previewItem={<Image source={{ uri: item.originalUrl }} style={props.imageStylePreview} transition={500} />}
                    items={[]}
                />
            ) : (
                <Image source={{ uri: item.originalUrl }} style={props.imageStyle} />
            )}
        </View>
    )

    return (
        <View>
            {console.log('RENDER SCREENSHOTS')}
            <Text style={props.headerTextStyle}>{props.headerText}</Text>
            <FlashList
                horizontal
                data={screenshots}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={props.containerStyle}
                removeClippedSubviews
            />
        </View>
    )
}

export default memo(ScreenshotsList);