import { getAnimeByMalId } from "@/API/Anilist/getAnimeById";
import { getRecommendationsJikan } from "@/API/Jikan/getRecommendationsJikan";
import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { getAnimeYummy } from "@/API/Yummy/getAnimeYummy";
import { getRecommendationsYummy } from "@/API/Yummy/Recommendations/getRecommendationsYummy";
import { useAnimeStore } from "@/store/animeStore";
import { checkAnimeAssets } from "@/utils/anime/checkAnimeAssets";
import { getCrunchyrollIData } from "@/utils/crunchyroll/getCrunchyrollData";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

// const fetchData = async (id: number | string, fetchCrunch: boolean) => {
//     try {
//         let postersArr = [];
//         let fallbackImage;
//         let crunchyPosters = {
//             hasTall: false,
//             hasWide: false,
//             poster: undefined,
//         };
//         let recommendations = [];

//         const [animeShiki, animeListData, recommendsJikan, yummy]: [ShikimoriAnime, any, any, any] = await Promise.all([
//             getAnimeList({ ids: id as string }).then(res => res[0]),
//             getAnimeByMalId(Number(id)),
//             getRecommendationsJikan(id as string),
//             getAnimeYummy(id as string),
//         ]);

//         if (recommendsJikan.length > 1) {
//             recommendations = recommendsJikan;
//         } else {
//             try {
//                 console.log('Jikan recs null, fetch yummy');
//                 const yummyRecs = await getRecommendationsYummy(yummy[0].anime_id);
//                 recommendations = yummyRecs;
//             } catch (error) {
//                 console.log(error)
//                 return [];
//             }
//         }


//         if (animeShiki && animeListData) {
//             fallbackImage = animeShiki.poster.originalUrl;

//             const [crunchData, assetsData,] = await Promise.all([
//                 fetchCrunch ? getCrunchyrollIData(animeListData, animeShiki.malId) : Promise.resolve(null),
//                 checkAnimeAssets(animeShiki.malId),
//             ]);

//             const { animatedPoster, translatedLogo } = assetsData;

//             if (crunchData) {
//                 console.log(crunchData)
//                 const hasTall = crunchData?.hasTallThumbnail ?? false;
//                 const hasWide = crunchData?.hasWideThumbnail ?? false;

//                 console.log('Crunchy has ', { hasTall: hasTall, hasWide: hasWide })

//                 crunchyPosters = {
//                     hasTall: hasTall,
//                     hasWide: hasWide,
//                     poster: crunchData?.crunchyImages?.img?.source,
//                 };

//                 if (crunchData?.crunchyImages?.img !== null)
//                     postersArr.push(crunchData?.crunchyImages?.img?.source);

//             }

//             postersArr.push(animeShiki?.poster?.originalUrl);
//             postersArr.push(animeListData?.coverImage.extraLarge);


//             setAnimeData({
//                 ...animeShiki,
//                 crunchyroll: { crunchyPosters: crunchyPosters, crunchyData: crunchData },
//                 animatedPoster,
//                 translatedLogo,
//                 animeList: animeListData,
//                 recommendations
//             });
//             setAnimeStore(Number(id), {
//                 ...animeShiki,
//                 crunchyroll: { crunchyPosters: crunchyPosters, crunchyData: crunchData },
//                 animatedPoster,
//                 translatedLogo,
//                 animeList: animeListData,
//                 recommendations
//             });
//         }

//     } catch (error) {
//         console.error("Ошибка при загрузке аниме по id:", error);
//         router.push({
//             pathname: '/(screens)/error',
//             params: { errText: String(error) }
//         });
//         setIsLoading(false);
//     }
// };


// отдельная функция загрузки
async function fetchAnimeById(id: number | string, fetchCrunch: boolean) {
    let recommendations = [];
    const [animeShiki, animeListData, recommendsJikan, yummy] = await Promise.all([
        getAnimeList({ ids: id as string }).then((res) => res[0]),
        getAnimeByMalId(Number(id)),
        getRecommendationsJikan(id as string),
        getAnimeYummy(id as string),
    ]);


    if (!animeShiki || !animeListData) return null;

    const [crunchData, assetsData, yummyRecs] = await Promise.all([
        fetchCrunch ? getCrunchyrollIData(animeListData, animeShiki.malId) : null,
        checkAnimeAssets(animeShiki.malId),
        !recommendsJikan.length && getRecommendationsYummy(yummy[0].anime_id)
    ]);

    const { animatedPoster, translatedLogo } = assetsData;

    recommendations = recommendsJikan.length > 1 ? recommendsJikan : yummyRecs.length > 1 ? yummyRecs : [];

    return {
        ...animeShiki,
        crunchyroll: {
            crunchyPosters: {
                hasTall: crunchData?.hasTallThumbnail ?? false,
                hasWide: crunchData?.hasWideThumbnail ?? false,
                poster: crunchData?.crunchyImages?.img?.source,
            },
            crunchyData: crunchData,
        },
        animatedPoster,
        translatedLogo,
        animeList: animeListData,
        recommendations,
    };
}



export const useAnimeFetch = (id: number | string) => {
    // const animeFromStore = useAnimeStore((s) => s.animeMap[Number(id)]);
    // const setAnimeStore = useAnimeStore((s) => s.setAnimeById);
    // const [animeData, setAnimeData] = useState<ShikimoriAnime>(animeFromStore || null);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const fetchCrunch = storage.getCrunchyPoster() ?? true;


    // useEffect(() => {
    //     if (!animeFromStore) {
    //         console.log('Нет в сторе');
    //         fetch()
    //             .then(() => setIsLoading(false));
    //     } else setIsLoading(false)
    // }, [id]);
    const animeFromStore = useAnimeStore((s) => s.animeMap[Number(id)]);
    const setAnimeStore = useAnimeStore((s) => s.setAnimeById);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCrunch = storage.getCrunchyPoster() ?? true;

    useEffect(() => {
        let active = true;

        const load = async () => {
            if (animeFromStore) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchAnimeById(id, fetchCrunch);
                if (data && active) {
                    setAnimeStore(Number(id), data);
                }
            } catch (error) {
                console.error("Ошибка при загрузке аниме по id:", error);
                router.push({
                    pathname: "/(screens)/error",
                    params: { errText: String(error) },
                });
            } finally {
                if (active) setIsLoading(false);
            }
        };

        load();

        return () => { active = false; };
    }, [id]);


    return {
        // animeData,
        animeData: animeFromStore ?? null,
        isLoading,
    }
};