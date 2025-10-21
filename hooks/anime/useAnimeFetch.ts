import { getAnimeByMalId } from "@/API/Anilist/getAnimeById";
import { getCrunchyrollIData } from "@/API/Crunchyroll/getCrunchyrollData";
import { getRecommendationsJikan } from "@/API/Jikan/getRecommendationsJikan";
import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { getAnimeYummy } from "@/API/Yummy/getAnimeYummy";
import { getEpisodesFromYummy } from "@/API/Yummy/getEpisodesFromYummy";
import { getRecommendationsYummy } from "@/API/Yummy/Recommendations/getRecommendationsYummy";
import { useAnimeStore } from "@/store/animeStore";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";

async function fetchAnimeById(id: number | string, fetchCrunch: boolean) {
    let recommendations = [];
    const [animeShiki, animeListData, recommendsJikan, yummy] = await Promise.all([
        getAnimeList({ ids: id as string }).then((res) => res[0]),
        getAnimeByMalId(Number(id)),
        getRecommendationsJikan(id as string),
        getAnimeYummy(id as string),
    ]);

    if (!animeShiki || !animeListData) return null;

    const [crunchData, yummyRecs, yummyEpisodes] = await Promise.all([
        fetchCrunch ? getCrunchyrollIData(animeListData, animeShiki.malId) : null,
        !recommendsJikan.length && getRecommendationsYummy(yummy[0].anime_id),
        false ? getEpisodesFromYummy({ shikimori_id: animeShiki.malId }) : [],
    ]);

    recommendations = recommendsJikan.length > 1 ? recommendsJikan : yummyRecs.length > 1 ? yummyRecs : [];

    return {
        ...animeShiki,
        crunchyroll: crunchData,
        animeList: animeListData,
        recommendations,
        yummyEpisodes,
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

    useEffect(() => {
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
                }
            } catch (error) {
                console.error("Ошибка при загрузке аниме по id:", error);
                router.replace({
                    pathname: "/(screens)/error",
                    params: { errText: String(error) },
                });
            } finally {
                setIsLoading(false);
            }
        };

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