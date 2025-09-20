import { Card } from "@/components/Anime/Card";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Button, Host, Image as UIImage } from "@expo/ui/swift-ui";
import { frame, padding } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo, useMemo } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Status } from "./Status";

interface HeaderProps {
    animeData: any;
    Right: React.ReactNode;
    animatedStyle1?: any;
    showStatus?: boolean;
    statusHeader?: string | null;
    fallbackImage?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const CustomHeader = ({
    animeData,
    Right,
    animatedStyle1,
    showStatus,
    statusHeader,
    fallbackImage,
}: HeaderProps) => {
    const insets = useSafeAreaInsets();

    const topInset = useMemo(() => insets.top / 1.25, [insets.top]);

    return (
        <>
            <View style={[styles.topBar, { paddingTop: topInset }]}>
                <Host style={{ width: 35, height: 35 }}>
                    <Button modifiers={[frame({ width: 35, height: 35 })]} variant='glass'
                        onPress={() => router.back()}
                    >
                        <UIImage systemName="arrow.left" size={20} modifiers={[padding({ vertical: 8 })]} />
                    </Button>
                </Host>
                {Right}
            </View>

            <Animated.View
                entering={FadeIn.delay(500)}
                style={[styles.infoRow, { paddingTop: topInset }]}
            >
                <Image
                    source={{ uri: animeData.poster.mainUrl }}
                    style={styles.posterThumb}
                />
                <View style={styles.infoTextWrapper}>
                    <Text style={styles.title} numberOfLines={1}>
                        {animeData?.russian}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{animeData?.airedOn?.year}</Text>
                        <Text style={styles.metaText}>•</Text>
                        <View style={styles.ratingRow}>
                            <IconSymbol name="star.fill" size={16} color="green" style={styles.starIcon} />
                            <Text style={styles.metaText}>{animeData?.score}</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={[styles.posterWrapper, animatedStyle1]}>
                <View style={[styles.posterContainer, { marginVertical: insets.top }]}>
                    <Animated.View
                        entering={FadeInUp.duration(1500)}
                        style={styles.posterShadow}
                    >
                        <Card>
                            {showStatus && (
                                <Status id={animeData.malId} showType="poster" status={statusHeader as string} />
                            )}
                            <Image
                                source={{ uri: animeData?.poster?.main2xUrl }}
                                style={styles.posterLarge}
                                priority="high"
                                transition={500}
                                contentFit="cover"
                            />
                        </Card>
                    </Animated.View>
                </View>

                <LinearGradient
                    colors={[
                        "transparent",
                        "rgba(0,0,0,0.35)",
                        "rgba(0,0,0,0.3)",
                        "rgba(0,0,0,1)",
                    ]}
                    style={styles.gradient}
                />

                <Image
                    source={{ uri: fallbackImage }}
                    style={styles.bgImage}
                    priority="high"
                    transition={300}
                    blurRadius={30}
                    contentFit="cover"
                />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    topBar: {
        position: "absolute",
        width: "100%",
        height: 140,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        zIndex: 1,
    },
    infoRow: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        width: SCREEN_WIDTH,
        height: 140,
        paddingHorizontal: 70,
        backgroundColor: "black",
        gap: 10,
        zIndex: -1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
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
        color: "white",
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
        color: "white",
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
    posterWrapper: {
        position: "absolute",
        width: "100%",
        height: 470,
        zIndex: -1,
    },
    posterContainer: {
        width: "100%",
        height: 400,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    posterShadow: {
        shadowColor: "gray",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 2, width: 0 },
    },
    posterLarge: {
        width: 240,
        height: 340,
        borderRadius: 12,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 470,
        zIndex: -2,
    },
    bgImage: {
        width: "100%",
        height: 470,
        position: "absolute",
        top: 0,
        zIndex: -3,
    },
});

export default memo(CustomHeader);
