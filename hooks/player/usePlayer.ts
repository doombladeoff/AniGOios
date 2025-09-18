import { getEpisodesData } from "@/API/Anilist/getEpisodesData";
import { findThumbnails } from "@/API/Kodik/findThumbnails";
import { getEpisodes } from "@/API/Kodik/getEpisodes";
import { getToken } from "@/API/Kodik/getToken";
import { getVideoUrl } from "@/API/Kodik/getVideoUrl";
import { getVoiceOvers } from "@/API/Kodik/getVoiceOvers";
import { favoriteVoiceOversID } from "@/constants/FavoriteVoiceoversID";
import { storage } from "@/utils/storage";
import { useCallback, useEffect, useRef, useState } from "react";

type VoiceOversT = {
    id: number;
    title: string;
};

type videoUrlT = {
    url: string;
    skip: { start: number | null | undefined; end: number | null | undefined } | undefined;
}
export const usePlayer = ({ id }: { id: number | string }) => {
    const lastEpisodeNumber = storage.getLastViewEpisode(id as string) ?? '1'; // Минимум 1
    const tokenRef = useRef<string | null>(null);
    const [voiceOvers, setVoiceOvers] = useState<VoiceOversT[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>();

    const [episodeList, setEpisodeList] = useState({});
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    const [videoUrl, setVideoUrl] = useState<videoUrlT | null | undefined>(null);

    const fetchVoiceOvers = async () => {
        const token = await getToken();
        tokenRef.current = token || '';
        const response = await getVoiceOvers(tokenRef.current, Number(id));
        if (response) {
            const result = response?.filter(item => favoriteVoiceOversID.includes(item.id));
            setVoiceOvers(result.length > 0 ? result : response);
        }
    };

    const fetchEpisodes = async () => {
        if (!tokenRef.current || voiceOvers.length < 1) return;
        const response = await getEpisodes(tokenRef.current, Number(id), voiceOvers[selectedIndex || 0].id);
        setEpisodeList(response)
    }

    const fetchVideoUrl = useCallback(async (episode: string) => {
        setVideoUrl(null);
        const link = await getVideoUrl(episode, episodeList);
        if (!link) return;
        const url: videoUrlT = { url: link?.url, skip: { end: link.skip?.end, start: link.skip?.start } }
        setVideoUrl(url);
        storage.setLastViewEpisode(id as string, episode);
    }, [episodeList]);


    useEffect(() => {
        if (tokenRef.current === '' || tokenRef.current === null) fetchVoiceOvers();
    }, []);

    useEffect(() => {
        if (voiceOvers.length > 0)
            fetchEpisodes();
    }, [voiceOvers]);

    useEffect(() => {
        if (!videoUrl && Object.keys(episodeList).length > 0) {
            fetchVideoUrl(lastEpisodeNumber);
        }

    }, [episodeList])

    useEffect(() => {
        fetchEpisodes();
    }, [selectedIndex]);

    const getThumb = async () => {
        const [thumbsKodik, thumbsAnilist] = await Promise.all([
            findThumbnails(episodeList),
            getEpisodesData(Number(id))
        ]);

        if (thumbsAnilist.streamingEpisodes.length > 0 && thumbsAnilist.streamingEpisodes.length === Object.keys(episodeList).length) {
            setThumbnails([...thumbsAnilist.streamingEpisodes].reverse());
        } else {
            if (thumbsKodik.length > 0) {
                setThumbnails(thumbsKodik);
            } else return [];
        }
    };


    useEffect(() => {
        if (Object.keys(episodeList).length > 0 && thumbnails.length < 1)
            getThumb();
    }, [episodeList])

    let animeId = id as string;
    const toggle = useCallback((id: number) => {
        const index = voiceOvers.findIndex(opt => opt.id === id);
        setSelectedIndex(index);
        storage.setSavedVoiceOvers(animeId, index.toString())
    }, [voiceOvers]);

    return {
        videoUrl,
        voiceOvers,
        selectedIndex,
        thumbnails,
        episodeList,
        toggle,
        fetchEpisodes,
        fetchVideoUrl,
        fetchVoiceOvers,
        findThumbnails,
    }
}