import { Screenshot } from "@/API/Shikimori/Shikimori.types";
import { FlashList } from "@shopify/flash-list";
import { Image, ImageStyle } from "expo-image";
import { Dispatch, memo, SetStateAction } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

interface ScreenshotsListProps {
    screenshots?: Screenshot[];
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle: StyleProp<ImageStyle>;
    onPress: Dispatch<SetStateAction<{ visible: boolean; currentImageIndex: number; }>>
}

const ScreenshotsList = (props: ScreenshotsListProps) => {
    const renderItem = ({ item, index }: { item: Screenshot, index: number }) => (
        <Pressable onPress={() => props.onPress({ visible: true, currentImageIndex: index })} style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 6 }}>
            <Image key={`img-${index}`} source={{ uri: item.x332Url }} style={props.imageStyle} contentFit='cover' transition={500} />
        </Pressable>
    );

    return (
        <FlashList
            horizontal
            data={props.screenshots}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={props.containerStyle}
            removeClippedSubviews
        />
    )
}

export default memo(ScreenshotsList);