import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { useAnimeStore } from "@/store/animeStore";
import { ImageStyle } from "expo-image";
import { memo, useState } from "react";
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import ImageView from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";
import ScreenshotsList from "./ScreenshotsList";

interface ScreenshotsListProps {
    id: string | number;
    imageStyle: StyleProp<ImageStyle>;
    headerText?: string;
    headerTextStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

const Screenshots = (props: ScreenshotsListProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();
    const [showImages, setIsVisible] = useState({ visible: false, currentImageIndex: 0 });

    const screenshots = useAnimeStore(useShallow(s => s.animeMap[props.id as number].screenshots))
    if (!screenshots || screenshots.length < 1) return null;

    const images = screenshots.map(s => ({ uri: s.originalUrl }));

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <ThemedText lightColor="black" style={props.headerTextStyle}>{props.headerText}</ThemedText>
                <Pressable onPress={() => setIsVisible({ visible: true, currentImageIndex: 0 })} style={{ backgroundColor: isDarkMode ? 'white' : 'black', borderRadius: 12, marginRight: 10 }}>
                    <ThemedText lightColor="white" darkColor="black" style={{ paddingVertical: 4, paddingHorizontal: 8 }}>Все</ThemedText>
                </Pressable>
            </View>

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

            <ScreenshotsList
                containerStyle={props.containerStyle}
                imageStyle={props.imageStyle}
                screenshots={screenshots.slice(0, 10)}
                onPress={setIsVisible}
            />
        </View>
    )
}

export default memo(Screenshots);