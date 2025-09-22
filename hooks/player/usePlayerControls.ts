import { auth } from "@/lib/firebase";
import { updateAnimeHistory, UpdateLastAnime } from "@/lib/firebase/update/userLastAnime";
import { storage } from "@/utils/storage";
import { VideoContentFit, VideoPlayer, VideoView } from "expo-video";
import { useCallback, useRef, useState } from "react";

type AnimeMeta = {
    malId: number | string;
    russian: string;
    poster: { originalUrl: string };
    episodes: number | string;
};

type UsePlayerControlsOptions = {
    player: VideoPlayer;
    playerRef: React.RefObject<VideoView | null>;
    animeMeta: AnimeMeta;
    episodeNumber: number | string;
    defaultSeekIndex?: number;
    markWatchedMinutes?: number;
};

const seekTimeOptions = [10, 30, 60];

export const usePlayerControls = ({
    player,
    playerRef,
    animeMeta,
    episodeNumber,
    markWatchedMinutes = 18,
}: UsePlayerControlsOptions) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const [contentFit, setContentFit] = useState<VideoContentFit>('cover');
    const [useNativeControls, setNativeControls] = useState(false);

    const seekTimeSelected = storage.getSkipTime() ?? 0;
    const seekTime = seekTimeOptions[seekTimeSelected] ?? seekTimeOptions[0];

    const isSkippedRef = useRef(false);
    const markWatchedRef = useRef(false);


    const tooglePlay = useCallback(() => {
        setIsPlaying(!isPlaying);

        if (isPlaying && auth.currentUser) {
            UpdateLastAnime(auth.currentUser.uid, {
                id: Number(animeMeta.malId),
                title: animeMeta.russian,
                poster: animeMeta.poster.originalUrl,
                totalEpisodes: Number(animeMeta.episodes),
                watchedEpisodes: Number(episodeNumber)
            });
            updateAnimeHistory(auth.currentUser.uid, {
                id: Number(animeMeta.malId),
                title: animeMeta.russian,
                poster: animeMeta.poster.originalUrl,
                totalEpisodes: Number(animeMeta.episodes),
                watchedEpisodes: Number(episodeNumber)
            });
        }

        if (isPlaying && player.status === 'readyToPlay') {
            player.pause();
        } else {
            player.play();
        }


        // if (useSaveEpisodeTime && player.currentTime > 0)
        //     storage.setSavedEpisodeTime(currentTime, props.episodeNumber, props.animeId)
    }, [player, isPlaying, episodeNumber]);



    // SEEK
    const seekBy = useCallback((seconds: number) => {
        if (!player) return;
        player.seekBy(seconds);
    }, [player]);

    const handleSeekLeft = useCallback(() => {
        seekBy(-seekTime);
    }, [seekBy, seekTime]);

    const handleSeekRight = useCallback(() => {
        seekBy(seekTime);
    }, [seekBy, seekTime]);

    //FULL SCREEN
    const handleFullScreen = useCallback(() => {
        if (contentFit === 'cover')
            setContentFit('contain');

        playerRef.current?.enterFullscreen();
        setNativeControls(true);
    }, [contentFit, useNativeControls]);

    return {
        isPlaying,
        tooglePlay,

        contentFit,
        setContentFit,
        useNativeControls,
        setNativeControls,

        handleFullScreen,

        seekTime,
        handleSeekLeft,
        handleSeekRight
    }
}