import { auth } from "@/lib/firebase";
import { useAnimeStore } from "@/store/animeStore";
import { updateAnimeHistory, UpdateLastAnime } from "@/utils/firebase/update/userLastAnime";
import { updateExp } from "@/utils/firebase/userRangUpdate";
import { storage } from "@/utils/storage";


import { Button } from "@/components/ui/Button";
import { useEvent } from "expo";
import { AnimationSpec } from "expo-symbols";
import { useVideoPlayer, VideoContentFit, VideoView } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleProp, Text, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { IconSymbol } from "../../ui/IconSymbol.ios";
import { Overlay } from "./Overlay";
import SeekBtn from "./Overlay/SeekBtn";
import { PlayerSlider } from "./Overlay/Slider";

interface PlayerProps {
    videoUrl: any;
    episodeNumber: number | string;
    animeId: number | string;
    updateStatus?: () => void;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    useWide?: boolean;
};

const animationButtons = {
    'PlayPause': {
        effect: {
            type: 'bounce',
        },
        speed: 10
    } as AnimationSpec,
}

export const Player = (props: PlayerProps) => {
    const isDefaultPlayer = storage.getDefaultPlayer() ?? false;
    const useSkipOpening = storage.getSkipOpening() ?? false;
    const seekTimeSelected = storage.getSkipTime() ?? 0;
    const seekOptions = [10, 30, 60];
    const seekTime = seekOptions[seekTimeSelected] ?? 10;

    const anime = useAnimeStore(s => s.animeMap[props.animeId as number]);

    const playerRef = useRef<VideoView>(null);
    const [contentFit, setContentFit] = useState<VideoContentFit>('cover');
    const [sliding, setSliding] = useState(false);
    const moveSlider = useRef(false);
    const [useNativeControls, setNativeControls] = useState(false);

    const useSaveEpisodeTime = storage.getSaveEpisodeTime() ?? false;
    const savedCurrentTime = storage.getSavedEpisodeTime(props.episodeNumber, props.animeId) ?? 0;
    const currTime = useRef<number>(0);

    const player = useVideoPlayer(
        props.videoUrl?.url,
        player => {
            player.loop = false;
            player.timeUpdateEventInterval = 1;
            // player.currentTime = savedCurrentTime;
            player.currentTime = 0;
            player.pause();
            // if (useSaveEpisodeTime && currTime.current > 0) storage.setSavedEpisodeTime(currTime.current, props.episodeNumber, props.animeId)
        });
    const duration = useRef(0);


    // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });


    const { currentTime } = useEvent(player, 'timeUpdate', { currentTime: player.currentTime, currentLiveTimestamp: null, currentOffsetFromLive: null, bufferedPosition: 0 });
    const fCur = Math.floor(player.currentTime);

    const { status } = useEvent(player, 'statusChange', { status: player.status });
    const isFull = useRef<any>(null);
    const setMarkWatched = useRef(false);
    const isSkiped = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        console.log("📺 Video mounted", {
            useSaveTime: useSaveEpisodeTime,
            currentTime: currTime.current,
            isDefaultPlayer: isDefaultPlayer,
            skipOpening: useSkipOpening,
            seekTimeSelected: seekTime
        });

        setMarkWatched.current = false;
        isSkiped.current = false;
        setIsPlaying(false);

        return () => {
            console.log("📺 Video unmounted");
            if (useSaveEpisodeTime && currTime.current > 0)
                storage.setSavedEpisodeTime(currTime.current, props.episodeNumber, props.animeId)
        };
    }, [props.videoUrl]);


    useEffect(() => {
        if (status === 'readyToPlay') {
            duration.current = player.duration;
            console.log(Math.floor(player.duration) / 60)
        }
    }, [status])

    useEffect(() => {
        // console.log({ currentTime: fCur, skipped: isSkiped.current, skipOpening: { from: props.videoUrl?.skip?.start, to: props.videoUrl?.skip?.end } });
        currTime.current = fCur;
        if (setMarkWatched.current) return;

        if ((fCur >= props.videoUrl?.skip?.start) && !isSkiped.current && useSkipOpening && !useSaveEpisodeTime) {
            player.seekBy(props.videoUrl?.skip?.end)
            isSkiped.current = true;
        }

        if ((Math.floor(player.currentTime) / 60) >= 18 && (Math.floor(player.currentTime) / 60) <= Math.floor(player.duration) / 60) {
            console.log('ПОСМОТРЕЛ');
            if (auth.currentUser) updateExp(auth.currentUser?.uid, 2);
            setMarkWatched.current = true;
            props.updateStatus?.();
        }
    }, [player.currentTime])

    useEffect(() => {
        if (!isFull.current && !isDefaultPlayer && !__DEV__)
            playerRef.current?.startPictureInPicture();
    }, [isFull.current]);


    const [showOverlay, setShowOverlay] = useState(true);
    const timerRef = useRef<number | null>(null);
    const opacity = useSharedValue(1);
    const bottom = useSharedValue(25);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    const animatedStyleBottom = useAnimatedStyle(() => ({
        bottom: bottom.value
    }));
    useEffect(() => {
        if (showOverlay && !sliding) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setShowOverlay(false);
                opacity.value = withTiming(!isPlaying ? 1 : 0, { duration: 800 });
                // bottom.value = withTiming(opacity.value === 0 ? 0 : 25, { duration: 300 })
            }, 6000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [showOverlay, sliding, isPlaying]);

    const handleInteraction = () => {
        setShowOverlay(true);
        opacity.value = withTiming(1, { duration: 300 });
    };


    //TIMED BUTTON
    const tbtn_opacity = useSharedValue(1);
    const tbtn_progress = useSharedValue(0);

    useEffect(() => {
        if (savedCurrentTime > 0 && isPlaying && props.useWide) {
            tbtn_opacity.value = 1
            tbtn_opacity.value = withDelay(
                1000,
                withTiming(1, { duration: 300 })
            );

            tbtn_progress.value = withDelay(
                1000,
                withTiming(1, { duration: 10000 })
            );

            tbtn_opacity.value = withDelay(
                11000,
                withTiming(0, { duration: 500 }, () => {
                    tbtn_progress.value = 0;
                })
            );
        }
    }, [savedCurrentTime, props.episodeNumber, isPlaying]);

    const tbtn_animatedStyle = useAnimatedStyle(() => ({
        opacity: tbtn_opacity.value,
    }));

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${interpolate(tbtn_progress.value, [0, 1], [0, 100], Extrapolation.CLAMP)}%`,
        };
    });


    const handleSeekLeft = useCallback(() => {
        player.seekBy(-seekTime);
    }, [player, seekTime]);

    const handleSeekRight = useCallback(() => {
        player.seekBy(seekTime);
    }, [player, seekTime]);


    const handleFullScreen = useCallback(() => {
        if (contentFit === 'cover')
            setContentFit('contain');
        if (props.useWide) {
            if (contentFit === 'contain')
                setContentFit('cover')
            else
                setContentFit('contain')
        }
        else {
            playerRef.current?.enterFullscreen();
            setNativeControls(true);
        }
    }, [contentFit, useNativeControls, props.useWide]);

    const handlePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);

        if (auth.currentUser) {
            UpdateLastAnime(auth.currentUser.uid, {
                id: Number(anime.malId),
                title: anime.russian,
                poster: anime.poster.originalUrl,
                totalEpisodes: Number(anime.episodes),
                watchedEpisodes: Number(props.episodeNumber)
            });
            updateAnimeHistory(auth.currentUser.uid, {
                id: Number(anime.malId),
                title: anime.russian,
                poster: anime.poster.originalUrl,
                totalEpisodes: Number(anime.episodes),
                watchedEpisodes: Number(props.episodeNumber)
            });
        }
        (isPlaying && status === 'readyToPlay') ? player.pause() : player.play();
    }, [player, status, isPlaying]);

    if (!props.videoUrl?.url) return <ActivityIndicator style={props.style || { width: '100%', height: 275 }} size={'small'} color={'white'} />

    return (
        <TouchableWithoutFeedback onPress={handleInteraction}>
            <View>
                {false &&
                    <Animated.View style={[animatedStyle, props.overlayStyle]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 10, paddingTop: 20 }}>
                            <Pressable
                                onPress={() => {
                                    if (contentFit === 'cover')
                                        setContentFit('contain')

                                    if (props.useWide) {
                                        if (contentFit === 'contain')
                                            setContentFit('cover')
                                        else
                                            setContentFit('contain')
                                    }
                                    else {
                                        playerRef.current?.enterFullscreen(); setNativeControls(true)
                                    }
                                }}
                                style={{ shadowColor: 'black', shadowOpacity: 0.65, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } }}
                            >
                                <IconSymbol name="arrow.down.left.and.arrow.up.right.rectangle.fill" size={28} color={'white'} />
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 60, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {status === 'loading' ? <ActivityIndicator size={'small'} color={'white'} /> : (
                                <>
                                    <Pressable onPress={handlePlayPause} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <IconSymbol
                                            name={(isPlaying) ? 'pause.fill' : 'play.fill'}
                                            // animationSpec={animationButtons['PlayPause']}
                                            size={44} color={'white'} style={{ shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } }} />
                                    </Pressable>
                                </>
                            )}
                        </View>
                    </Animated.View>
                }

                <Overlay
                    animatedStyle={animatedStyle}
                    overlayStyle={props.overlayStyle}
                    pressFullScreen={handleFullScreen}
                >
                    <View style={{ flexDirection: 'row', gap: 60, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <SeekBtn
                            iconSeekTime={String(seekTime)}
                            onPress={handleSeekLeft}
                            type="left"
                        />
                        {status === 'loading' ? <ActivityIndicator size={'small'} color={'white'} style={{ width: 46, height: 46, borderRadius: 32, justifyContent: 'center', alignItems: 'center', }} /> : (
                            <Button
                                width={46}
                                height={46}
                                iconName={(isPlaying && status === 'readyToPlay') ? 'pause.fill' : 'play.fill'}
                                onPressBtn={handlePlayPause}
                                style={{ shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } }}
                            />
                        )}
                        <SeekBtn
                            iconSeekTime={String(seekTime)}
                            onPress={handleSeekRight}
                            type="right"
                        />
                    </View>


                    <PlayerSlider
                        currentTime={currentTime}
                        maximumValue={duration.current}
                        duration={duration.current}
                        style={animatedStyleBottom}
                        onSlidingStart={(v) => console.log(v)}
                        onValueChange={(v) => {
                            if (!moveSlider.current) {
                                moveSlider.current = true;
                                console.log(moveSlider.current);
                                setSliding(true)
                            }
                        }}
                        onSlidingComplete={(v) => { player.currentTime = v; moveSlider.current = false; setSliding(false) }}

                    />
                </Overlay>

                {false &&
                    <Animated.View style={[tbtn_animatedStyle, { alignItems: "center", position: 'absolute', zIndex: 200, right: 10, bottom: 80 }]}>
                        <Pressable
                            style={{
                                width: 150,
                                height: 30,
                                backgroundColor: "dodgerblue",
                                borderRadius: 6,
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                            }}
                            onPress={() => player.currentTime = savedCurrentTime}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Продолжить</Text>

                            {/* Прогресс-бар сверху */}
                            <Animated.View
                                style={[
                                    {
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        height: 4,
                                        backgroundColor: "white",
                                    },
                                    progressStyle,
                                ]}
                            />
                        </Pressable>
                    </Animated.View>
                }

                <VideoView
                    player={player}
                    style={props.style || { position: 'absolute', zIndex: -10, top: -200 }}
                    ref={playerRef}
                    nativeControls={useNativeControls}
                    fullscreenOptions={{ enable: true }}
                    allowsPictureInPicture
                    onFullscreenEnter={() => isFull.current = true}
                    onFullscreenExit={async () => {
                        isFull.current = false;
                        setNativeControls(false);
                        setContentFit('cover');
                    }}
                    startsPictureInPictureAutomatically
                    contentFit={contentFit}
                />
            </View>
        </TouchableWithoutFeedback >
    )
}