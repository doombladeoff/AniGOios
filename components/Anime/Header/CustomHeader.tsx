import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    SharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    animeData: any;
    fallbackImage?: string;
    scrollY: SharedValue<number>;
}

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const CustomHeader = ({ animeData, scrollY }: HeaderProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();

    const topInset = useMemo(() => insets.top / 1.25, [insets.top]);

    const animatedHeader = useAnimatedStyle(() => {
        const visible = scrollY.value >= 330;

        return {
            opacity: withTiming(visible ? 1 : 0, { duration: 250 }),
            transform: [
                {
                    translateY: withTiming(visible ? 0 : -60, { duration: 300 }),
                },
            ],
        };
    });

    return (
        <Animated.View style={[{ zIndex: 10 }, animatedHeader]}>
            <BlurView
                tint={isDarkMode ? 'dark' : 'light'}
                intensity={100}
                style={[styles.infoRow, { paddingTop: topInset - 10 }]}
            >
                <Image
                    source={{ uri: animeData?.poster?.mainUrl }}
                    style={styles.posterThumb}
                />

                <View style={styles.infoTextWrapper}>
                    <ThemedText style={styles.title} numberOfLines={1}>
                        {animeData?.russian}
                    </ThemedText>

                    <View style={styles.metaRow}>
                        <ThemedText lightColor="black" darkColor="white" style={styles.metaText}>
                            {animeData?.airedOn?.year}
                        </ThemedText>
                        <ThemedText lightColor="black" darkColor="white" style={styles.metaText}>
                            •
                        </ThemedText>
                        <View style={styles.ratingRow}>
                            <IconSymbol name="star.fill" size={16} color="green" style={styles.starIcon} />
                            <ThemedText lightColor="black" darkColor="white" style={styles.metaText}>
                                {animeData?.score}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    infoRow: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        width: SCREEN_WIDTH,
        height: 140,
        paddingHorizontal: 70,
        gap: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
    },
    posterThumb: {
        width: 60,
        height: 80,
        borderRadius: 12,
    },
    infoTextWrapper: {
        flex: 1,
        flexShrink: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 5,
    },
    metaText: {
        fontSize: 14,
        fontWeight: "400",
        marginTop: 5,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    starIcon: {
        top: 2,
    },
});

export default memo(CustomHeader);
