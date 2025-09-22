import { auth } from "@/lib/firebase";
import { updateExp } from "@/lib/firebase/userRangUpdate";
import { useAnimeStore } from "@/store/animeStore";
import { storage } from "@/utils/storage";

import { Button } from "@/components/ui/Button";
import { useOverlay } from "@/hooks/player/useOverlay";
import { videoUrlT } from "@/hooks/player/usePlayer";
import { usePlayerControls } from "@/hooks/player/usePlayerControls";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Overlay } from "./Overlay";
import SeekBtn from "./Overlay/SeekBtn";
import { PlayerSlider } from "./Overlay/Slider";

interface PlayerProps {
    videoUrl: videoUrlT;
    episodeNumber: number | string;
    animeId: number | string;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    useWide?: boolean;
};

export const VideoPlayer = (props: PlayerProps) => {
    const anime = useAnimeStore(s => s.animeMap[props.animeId as number]);

    const useSkipOpening = storage.getSkipOpening() ?? false;
    const useSaveEpisodeTime = storage.getSaveEpisodeTime() ?? false;
    const savedCurrentTime = storage.getSavedEpisodeTime(props.episodeNumber, props.animeId) ?? 0;

    const setMarkWatched = useRef(false);
    const isSkiped = useRef(false);

    const [sliding, setSliding] = useState({
        sliding: false,
        duration: 0,
    });

    const playerRef = useRef<VideoView>(null);
    const player = useVideoPlayer(
        props.videoUrl?.url,
        player => {
            player.loop = false;
            player.timeUpdateEventInterval = 1;
            player.currentTime = savedCurrentTime;
            player.pause();
        });

    const { currentTime } = useEvent(player, 'timeUpdate',
        {
            currentTime: Math.floor(player.currentTime),
            currentLiveTimestamp: null,
            currentOffsetFromLive: null,
            bufferedPosition: 0
        });

    const { status } = useEvent(player, 'statusChange', { status: player.status });

    const controls = usePlayerControls({
        player,
        playerRef,
        animeMeta: anime,
        episodeNumber: props.episodeNumber,
        defaultSeekIndex: storage.getSkipTime() ?? 0,
        markWatchedMinutes: 18,
    })

    useEffect(() => {
        console.log("📺 Player mounted", {
            useSaveTime: useSaveEpisodeTime,
            currentTime: currentTime,
            skipOpening: useSkipOpening,
            seekTimeSelected: controls.seekTime
        });

        setMarkWatched.current = false;
        isSkiped.current = false;

        return () => { console.log("📺 Player unmounted") };
    }, [props.videoUrl, player]);

    useEffect(() => {
        if (status !== 'readyToPlay') return;

        setSliding(prev => ({ ...prev, duration: player.duration }))
        console.log(Math.floor(player.duration) / 60);
    }, [status])

    useEffect(() => {
        if (setMarkWatched.current) return;

        if ((currentTime >= props.videoUrl?.skip.start) && !isSkiped.current && useSkipOpening && !useSaveEpisodeTime) {
            player.seekBy(props.videoUrl?.skip.end)
            isSkiped.current = true;
        }

        if ((currentTime / 60) >= 18 && (currentTime / 60) <= Math.floor(player.duration) / 60) {
            console.log('Пользователь просмотрел серию');
            if (auth.currentUser) updateExp(auth.currentUser?.uid, 2);
            setMarkWatched.current = true;
        }
    }, [player.currentTime])

    const overlay = useOverlay({
        isPlaying: controls.isPlaying,
        isSliding: sliding.sliding,
        autoHideMs: 6000,
        initialShown: true,
    });

    if (!props.videoUrl?.url) return <ActivityIndicator style={props.style || { width: '100%', height: 275 }} size={'small'} color={'white'} />

    return (
        <TouchableWithoutFeedback onPress={overlay.handleInteraction}>
            <View>
                <Overlay
                    animatedStyle={overlay.animatedStyle}
                    overlayStyle={props.overlayStyle}
                    pressFullScreen={controls.handleFullScreen}
                >
                    <View style={{ flexDirection: 'row', gap: 60, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <SeekBtn
                            iconSeekTime={String(controls.seekTime)}
                            onPress={controls.handleSeekLeft}
                            type="left"
                        />
                        <Button
                            width={46}
                            height={46}
                            iconName={(controls.isPlaying && status === 'readyToPlay') ? 'pause.fill' : 'play.fill'}
                            onPressBtn={controls.tooglePlay}
                            style={{ shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } }}
                        />
                        <SeekBtn
                            iconSeekTime={String(controls.seekTime)}
                            onPress={controls.handleSeekRight}
                            type="right"
                        />
                    </View>

                    <PlayerSlider
                        currentTime={currentTime}
                        maximumValue={sliding.duration}
                        duration={sliding.duration}
                        style={{ bottom: 25 }}
                        onSlidingStart={(v) => console.log(v)}
                        onValueChange={(v) => {
                            setSliding(prev => ({ ...prev, sliding: true }))
                        }}
                        onSlidingComplete={(v) => {
                            player.currentTime = v;
                            setSliding(prev => ({ ...prev, sliding: false }))
                        }}
                        isSliding={sliding.sliding}
                    />
                </Overlay>

                <VideoView
                    player={player}
                    style={props.style || { position: 'absolute', zIndex: -10, top: -200 }}
                    ref={playerRef}
                    nativeControls={controls.useNativeControls}
                    fullscreenOptions={{ enable: true }}
                    allowsPictureInPicture
                    startsPictureInPictureAutomatically
                    onFullscreenExit={() => {
                        controls.setNativeControls(false);
                        controls.setContentFit('cover');
                    }}
                    contentFit={controls.contentFit}
                />
            </View>
        </TouchableWithoutFeedback >
    )
};