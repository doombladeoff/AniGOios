import { useMappingHelper } from "@shopify/flash-list";
import { Image, ImageContentFit, ImageStyle } from "expo-image";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

interface CardPosterProps {
    img: string;
    imgFit?: ImageContentFit;
    imgCachePolicy?: "none" | "disk" | "memory" | "memory-disk" | null | undefined;
    imgPriority?: "low" | "high" | "normal" | null | undefined;
    transition?: number;
    imgStyle: StyleProp<ImageStyle>;
    container?: StyleProp<ViewStyle>;
    pressable?: boolean;
    onPress?: () => void;
    children?: React.ReactNode;
    index?: number
}
export const CardPoster = ({
    img,
    imgFit,
    imgCachePolicy,
    imgPriority,
    transition,
    imgStyle,
    container,
    onPress,
    children,
    index
}: CardPosterProps) => {
    const { getMappingKey } = useMappingHelper();
    return (
        <Pressable disabled={!onPress || false} style={container} onPress={onPress}>
            <View style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
            }}>
                <Image
                    key={index ? getMappingKey(`${img}`, index) : img}
                    transition={transition}
                    source={{ uri: img }}
                    style={imgStyle}
                    cachePolicy={imgCachePolicy}
                    contentFit={imgFit}
                    priority={imgPriority}
                />
            </View>
            {children}
        </Pressable>
    )
}