import { getAnimeByMalId } from "@/API/Anilist/getAnimeById";
import { getCrunchyrollIData } from "@/API/Crunchyroll/getCrunchyrollData";
import { getRecommendationsById } from "@/API/Shikimori/getRecommendationsById";
import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { useAnimeStore } from "@/store/animeStore";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";

async function fetchAnimeById(id: number | string, fetchCrunch: boolean) {
    const [animeShiki, animeListData, recommendationsShikimori] = await Promise.all([
        getAnimeList({ ids: id as string }).then((res) => res[0]),
        getAnimeByMalId(Number(id)),
        getRecommendationsById(id),
    ]);

    if (!animeShiki) return null;

    let crunchData = null;
    if (fetchCrunch && animeListData) {
        crunchData = await getCrunchyrollIData(animeListData, animeShiki.malId);
    }

    return {
        ...animeShiki,
        crunchyroll: crunchData,
        ...(animeListData && { animeList: animeListData }),
        recommendations: recommendationsShikimori,
    };
}

export const useAnimeFetch = (id: number | string) => {
    const animeFromStore = useAnimeStore((s) => s.animeMap[Number(id)]);
    const setAnimeStore = useAnimeStore((s) => s.setAnimeById);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCrunch = storage.getCrunchyPoster() ?? true;

    const useCrunch = animeFromStore?.crunchyroll?.hasTallThumbnail
        ? storage?.getCrunchyPoster?.() ?? true
        : false;

    const usePoster3D = !animeFromStore?.crunchyroll?.hasTallThumbnail
        ? true
        : storage?.get3DPoster?.() ?? false;

    const load = async () => {
        if (animeFromStore) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchAnimeById(id, fetchCrunch);
            if (data) {
                setAnimeStore(Number(id), data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Ошибка при загрузке аниме по id:", error);
            router.replace({
                pathname: "/(screens)/error",
                params: { errText: String(error) },
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const backgroundImage = useMemo(() => {
        if (animeFromStore?.crunchyroll?.hasTallThumbnail) return animeFromStore.crunchyroll.crunchyImages.tallThumbnail;
        if (animeFromStore?.crunchyroll?.hasWideThumbnail) return animeFromStore.crunchyroll.crunchyImages.wideThumbnail;
    }, [animeFromStore?.crunchyroll?.hasTallThumbnail, animeFromStore?.crunchyroll?.hasWideThumbnail]);

    return {
        animeData: animeFromStore ?? null,
        isLoading,
        useCrunch,
        usePoster3D,
        backgroundImage
    }
};