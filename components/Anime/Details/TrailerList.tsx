import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import { FlatList, Modal, Pressable, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";

export const TrailerList = ({ videos }: { videos: any[] }) => {
    const [activeVideo, setActiveVideo] = useState<any | null>(null);
    const playerRef = useRef<YoutubeIframeRef>(null);

    const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
        const videoId = item.url.split("v=")[1] || item.url.split("/").pop();
        const badgeLabel = item.name?.toLowerCase().includes("pv") ? item.name : `PV${index + 1}`;

        return (
            <Animated.View
                entering={FadeIn.delay(index * 100)}
                exiting={FadeOut}
                style={{
                    marginRight: 12,
                    width: 250,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}
            >
                <TouchableOpacity onPress={() => setActiveVideo({ id: item.id, videoId })}>
                    <Image
                        source={{
                            uri: item.imageUrl.startsWith("http") ? item.imageUrl : `https:${item.imageUrl}`,
                        }}
                        style={{ width: "100%", height: 140 }}
                        contentFit="cover"
                    />
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                    >
                        <IconSymbol name="play.circle" size={48} color="white" />
                    </View>

                    {/* бейдж */}
                    <View
                        style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "#ff453a",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                        }}
                    >
                        <ThemedText style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
                            {badgeLabel}
                        </ThemedText>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }, []);

    return (
        <>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 5 }}
            />

            <Modal visible={!!activeVideo} transparent animationType="fade">
                <Pressable
                    onPress={() => setActiveVideo(null)}
                    style={{
                        position: 'absolute',
                        top: useSafeAreaInsets().top * 1.5,
                        right: 30,
                        zIndex: 100
                    }}
                >
                    <IconSymbol name="xmark" size={24} color={'white'} />
                </Pressable>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {activeVideo && (
                        <Animated.View entering={FadeIn.duration(200)} style={{ width: "100%", backgroundColor: '#888', borderRadius: 24, overflow: "hidden" }}>
                            <YoutubePlayer
                                ref={playerRef}
                                height={220}
                                videoId={activeVideo.videoId}
                                play={true}
                                initialPlayerParams={{
                                    preventFullScreen: false
                                }}
                                onChangeState={(state: any) => {
                                    playerRef.current?.getCurrentTime().then(
                                        currentTime => console.log({ currentTime })
                                    );
                                    if (state === "ended") setActiveVideo(null);
                                }}
                            />
                        </Animated.View>
                    )}
                </View>
            </Modal>
        </>
    );
};
