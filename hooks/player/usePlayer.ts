import { getEpisodes } from "@/API/Kodik/getEpisodes";
import { getVideoUrl } from "@/API/Kodik/getVideoUrl";
import { getVoiceOvers } from "@/API/Kodik/getVoiceOvers";
import { favoriteVoiceOversID } from "@/constants/FavoriteVoiceoversID";
import { storage } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";

type VoiceOversT = {
    id: number;
    title: string;
};

export type videoUrlT = {
    url: string;
    skip: { start: number; end: number };
};

export const usePlayer = ({ animeId }: { animeId: number | string }) => {
    const lastEpisodeNumber = storage.getLastViewEpisode(animeId as string) ?? '1';
    const [voiceOvers, setVoiceOvers] = useState<VoiceOversT[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const [episodeList, setEpisodeList] = useState<Record<string, any>>({});
    const [videoUrl, setVideoUrl] = useState<videoUrlT | null>(null);

    const fetchVoiceOvers = useCallback(async () => {
        if (!process.env.EXPO_PUBLIC_KODIK_TOKEN) return;

        const result = await getVoiceOvers(process.env.EXPO_PUBLIC_KODIK_TOKEN, Number(animeId));
        if (!result) return;

        const filtered = result.filter(item => favoriteVoiceOversID.includes(item.id));
        const filteredlVoiceOvers = filtered.length > 0 ? filtered : result;

        setVoiceOvers(filteredlVoiceOvers);

        const savedIndex = storage.getSavedVoiceOvers(animeId as string);
        if (savedIndex !== null && Number(savedIndex) < filteredlVoiceOvers.length) {
            setSelectedIndex(Number(savedIndex));
        } else {
            setSelectedIndex(0);
        }
    }, [animeId]);

    const fetchEpisodes = useCallback(async () => {
        if (!process.env.EXPO_PUBLIC_KODIK_TOKEN) return;
        if (voiceOvers.length === 0) return;

        const response = await getEpisodes(
            process.env.EXPO_PUBLIC_KODIK_TOKEN,
            Number(animeId),
            voiceOvers[selectedIndex].id
        );

        setEpisodeList(response);
    }, [animeId, selectedIndex, voiceOvers]);

    const fetchVideoUrl = useCallback(async (episode: string) => {
        const link = await getVideoUrl(episode, episodeList);
        if (!link) return;

        const url: videoUrlT = {
            url: link.url,
            skip: { end: link.skip?.end, start: link.skip?.start },
        };

        setVideoUrl(url);
        storage.setLastViewEpisode(animeId as string, episode);
    }, [animeId, episodeList]);

    useEffect(() => {
        fetchVoiceOvers();
    }, [fetchVoiceOvers]);

    useEffect(() => {
        if (voiceOvers.length > 0) {
            fetchEpisodes();
        }
    }, [voiceOvers, selectedIndex, fetchEpisodes]);

    useEffect(() => {
        if (Object.keys(episodeList).length > 0) {
            fetchVideoUrl(lastEpisodeNumber);
        }
    }, [episodeList]);

    const toggle = useCallback((id: number) => {
        const index = voiceOvers.findIndex(opt => opt.id === id);
        setSelectedIndex(index);
        storage.setSavedVoiceOvers(animeId as string, index.toString())
    }, [animeId, voiceOvers]);

    return {
        videoUrl,
        voiceOvers,
        selectedIndex,
        episodeList,
        toggle,
        fetchEpisodes,
        fetchVideoUrl,
        fetchVoiceOvers,
    }
}