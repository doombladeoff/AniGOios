import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ContextMenu } from "./ContextComponent";
import { IconSymbol } from "./ui/IconSymbol.ios";

interface ContinueWatchingProps {
    title: string;
    posterUrl: string;
    totalEpisodes: number;
    watchedEpisodes: number;
    id: number;
    user?: any;
    onUpdate: (id: number, watchedEpisodes: number) => void;
    showHeader?: boolean;
}

export const ContinueWatching: React.FC<ContinueWatchingProps> = ({
    title,
    posterUrl,
    totalEpisodes,
    watchedEpisodes,
    id,
    onUpdate,
    showHeader = true,
}) => {
    const progress = useSharedValue(
        totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0
    );

    useEffect(() => {
        const newProgress = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;
        progress.value = withTiming(newProgress, { duration: 500 });
    }, [watchedEpisodes, totalEpisodes]);

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    const handleNavigate = useCallback(() => {
        router.push({ pathname: '/(screens)/(anime)/animeHistory' })
    }, []);

    return (
        <View style={{ marginHorizontal: 5 }}>
            {showHeader && (
                <View style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10
                }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: "600",
                        }}
                    >
                        История
                    </Text>
                    <Pressable hitSlop={30} onPress={handleNavigate}>
                        <IconSymbol name="arrow.right" size={16} color="white" />
                    </Pressable>
                </View>
            )}

            <ContextMenu
                triggerItem={
                    <View style={styles.card}>
                        <Image source={{ uri: posterUrl }} style={styles.image} contentFit="cover" />

                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,1)"]}
                            style={StyleSheet.absoluteFill}
                        />


                        {watchedEpisodes === totalEpisodes && (
                            <Animated.View entering={FadeInDown.duration(750)} exiting={FadeOut} style={styles.progressBadge}>
                                <IconSymbol name="checkmark" color="rgba(0, 255, 81, 1)" size={14} />
                                <Text style={styles.progressBadgeText}>Просмотрено</Text>
                            </Animated.View>
                        )}

                        <View style={styles.content}>
                            <Text style={styles.title} numberOfLines={2}>
                                {title}
                            </Text>

                            <View style={styles.progressBar}>
                                <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Pressable onPress={() => {
                                    const animeId = String(id);
                                    router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: animeId } });
                                }}
                                    style={styles.button}>
                                    <IconSymbol
                                        name="play.fill"
                                        color="white"
                                        style={{ width: 22, height: 22, marginRight: 6 }}
                                    />

                                    <Text style={styles.buttonText}>Продолжить</Text>
                                </Pressable>

                                <Text style={styles.title}>{watchedEpisodes} / {totalEpisodes}</Text>
                            </View>

                        </View>
                    </View>
                }
                items={[
                    {
                        title: 'Сбросить',
                        destructive: true,
                        iconName: 'clear.fill',
                        onSelect: () => onUpdate(id, 0),
                    },
                ]}
                subTrigger={
                    [
                        {
                            title: 'Изменить серии',
                            items: Array.from({ length: totalEpisodes }, (_, i) => ({
                                title: `Серия ${i + 1}`,
                                onSelect: () => onUpdate(id, i + 1),
                            })),
                        }
                    ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        minHeight: 160,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
        // marginRight: 15,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
    },
    title: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.3)",
        marginBottom: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#e50914",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    progressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        position: "absolute",
        gap: 6,
        top: 6,
        left: 6,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 2,
    },
    progressBadgeText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
});
