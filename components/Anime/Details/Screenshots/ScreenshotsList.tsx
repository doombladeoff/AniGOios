import { Screenshot } from "@/API/Shikimori/Shikimori.types";
import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { Image, ImageStyle } from "expo-image";
import { memo, useState } from "react";
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import ImageView from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";

interface ScreenshotsListProps {
    id: string | number;
    screenshots?: Screenshot[];
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle: StyleProp<ImageStyle>;
    headerText?: string;
    headerTextStyle?: StyleProp<TextStyle>;
}

const ScreenshotsList = (props: ScreenshotsListProps) => {
    const insets = useSafeAreaInsets();
    const [showImages, setIsVisible] = useState({ visible: false, currentImageIndex: 0 });

    const screenshots = useAnimeStore(useShallow(s => s.animeMap[props.id as number].screenshots))
    if (!screenshots || screenshots.length < 1) return null;

    const images = screenshots.map(s => ({ uri: s.originalUrl }));

    const renderItem = ({ item, index }: { item: Screenshot, index: number }) => (
        <Pressable onPress={() => setIsVisible({ visible: true, currentImageIndex: index })}>
            <Image source={{ uri: item.x332Url }} style={props.imageStyle} contentFit='cover' transition={500} />
        </Pressable>
    );

    return (
        <View>
            <ImageView
                images={images}
                imageIndex={showImages.currentImageIndex}
                visible={showImages.visible}
                onRequestClose={() => setIsVisible({ visible: false, currentImageIndex: 0 })}
                animationType='fade'
                swipeToCloseEnabled
                backgroundColor='rgba(0,0,0,0.95)'
                presentationStyle='overFullScreen'
                FooterComponent={({ imageIndex }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: insets.bottom }}>
                        <Text style={{ color: 'white' }}>{imageIndex + 1} / {images.length}</Text>
                    </View>
                )}
            />
            <Text style={props.headerTextStyle}>{props.headerText}</Text>
            <FlashList
                horizontal
                data={screenshots.slice(0, 10)}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={props.containerStyle}
                removeClippedSubviews
            />
        </View>
    )
}

export default memo(ScreenshotsList);