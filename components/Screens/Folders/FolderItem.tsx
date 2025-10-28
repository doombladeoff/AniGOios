import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useEffect } from "react"
import { Pressable, View } from "react-native"
import Animated, { FadeInRight, FadeOut, FadeOutLeft, LinearTransition, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import AnimeItem from "../Search/AnimeItem"

interface FolderItemProps {
    editMode: boolean;
    include: boolean;
    onPress: () => void;
    item: ShikimoriAnime;
    index: number;
}

export const FolderItem = ({ editMode, include, onPress, item, index }: FolderItemProps) => {
    const scale = useSharedValue(include ? 1 : 0.8);

    useEffect(() => {
        if (include) {
            scale.value = withSpring(1, { damping: 40 });
        } else {
            scale.value = withTiming(0.8, { duration: 200 });
        }
    }, [include, editMode]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            layout={LinearTransition.springify()}
            entering={FadeInRight.delay(200 * (index + 1)).duration(350)}
            exiting={FadeOutLeft}
        >
            <Pressable style={{ flexDirection: 'row' }} onPress={onPress}>
                {editMode && (
                    <Animated.View
                        entering={FadeInRight}
                        exiting={FadeOut}
                        style={{ justifyContent: 'center', marginRight: 10 }}
                    >
                        <Animated.View style={animatedStyle}>
                            <IconSymbol
                                name={include ? 'checkmark.circle.fill' : 'circle'}
                                size={24}
                            />
                        </Animated.View>
                    </Animated.View>
                )}
                <View style={{ flex: 1 }} pointerEvents={editMode ? 'none' : 'box-only'}>
                    <AnimeItem item={item} index={index} />
                </View>
            </Pressable>
        </Animated.View>
    );
};