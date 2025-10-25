import { useTheme } from "@/hooks/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ContextMenu } from "./ContextComponent";
import { ListHeader } from "./List/ListHeader";
import { IconSymbol } from "./ui/IconSymbol.ios";
import { ThemedText } from "./ui/ThemedText";

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
    const isDarkMode = useTheme().theme === 'dark';
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
        router.push({ pathname: '/(screens)/anime/animeHistory' })
    }, []);

    return (
        <View style={{ marginHorizontal: 5 }}>
            {showHeader && (
                <ListHeader
                    text="История"
                    textStyle={{
                        fontSize: 18,
                        fontWeight: "600",
                    }}
                    iconName="arrow.right"
                    iconSize={22}
                    containerStyle={{
                        marginVertical: 10,
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    onPress={handleNavigate}
                />
            )}

            <ContextMenu
                triggerItem={
                    <View style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                    }}>
                        <View style={styles.card}>

                            <Image source={{ uri: posterUrl }} style={styles.image} contentFit="cover" />

                            <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 150 }}>
                                <LinearGradient
                                    colors={isDarkMode ? ["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,1)"] : ["transparent", "rgba(255,255,255,0.1)", "rgba(255,255,255,1)"]}
                                    style={StyleSheet.absoluteFill}
                                />
                            </View>

                            {watchedEpisodes === totalEpisodes && (
                                <Animated.View entering={FadeInDown.duration(750)} exiting={FadeOut} style={styles.progressBadge}>
                                    <IconSymbol name="checkmark" color="rgba(0, 255, 81, 1)" size={14} />
                                    <Text style={styles.progressBadgeText}>Просмотрено</Text>
                                </Animated.View>
                            )}

                            <View style={styles.content}>
                                <ThemedText lightColor="white" style={styles.title} numberOfLines={2}>
                                    {title}
                                </ThemedText>

                                <View style={styles.progressBar}>
                                    <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Pressable onPress={() => {
                                        const animeId = String(id);
                                        router.push({ pathname: '/(screens)/anime/[id]', params: { id: animeId } });
                                    }}
                                        style={styles.button}>
                                        <IconSymbol
                                            name="play.fill"
                                            color="white"
                                            style={{ width: 22, height: 22, marginRight: 6 }}
                                        />

                                        <Text style={styles.buttonText}>Продолжить</Text>
                                    </Pressable>

                                    <View style={styles.episodeContainer}>
                                        <ThemedText lightColor="white" darkColor="white" style={styles.title}>{watchedEpisodes} / {totalEpisodes}</ThemedText>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                }
                items={
                    [
                        {
                            title: 'Сбросить',
                            destructive: true,
                            iconName: 'clear.fill',
                            onSelect: () => onUpdate(id, 0),
                            iconColor: 'red'
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
        </View >
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        minHeight: 160,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
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
        backgroundColor: "rgba(35, 35, 35, 1)",
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
    episodeContainer: {
        backgroundColor: "rgba(35, 35, 35, 1)",
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingTop: 6,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
