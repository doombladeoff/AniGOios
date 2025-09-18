import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { getHomeRecs } from "@/API/Yummy/Recommendations/getHomeRecs";
import { filmsProps, onScreenProps, topProps } from "@/constants/RequestProps";
import { auth } from "@/lib/firebase";
import { LastAnime, useUserStore } from "@/store/userStore";
import { getLastAnime, updateAnimeHistory } from "@/utils/firebase/update/userLastAnime";
import { MaterialObject } from "kodikwrapper";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { fetchLastUpdates } from "./fetchLastUpdates";
import { fetchListWithBanners } from "./fetchListWithBanners";

const fields: AnimeFields = {
    id: true,
    malId: true,
    poster: { id: true, main2xUrl: true, originalUrl: true, mainUrl: true },
    description: true,
    russian: true,
    score: true,
    status: true,
    airedOn: { year: true },
    episodes: true,
    genres: { russian: true, id: true }
};

type LastUpdatesT = MaterialObject & {
    id: string;
    poster: {
        originalUrl: {} | null
    }
};

type AnimeList = {
    topRated: any[];
    onScreen: any[];
    films: any[];
}

export function useHomeScreenData() {
    const user = useUserStore(useShallow(s => s.user?.lastAnime));

    const [animeList, setAnimeList] = useState<AnimeList>({
        topRated: [],
        onScreen: [],
        films: [],
    });

    const [lastUpdates, setLastUpdates] = useState<LastUpdatesT[]>([]);
    const [lastAnime, setLastAnime] = useState<LastAnime[]>([]);
    const [homeRecs, setHomeRecs] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnimeLists = async () => {
        try {
            const [topRated, onScreen, films, lastUpd, homeRecs] = await Promise.all([
                fetchListWithBanners(topProps, fields),
                fetchListWithBanners(onScreenProps, fields),
                fetchListWithBanners(filmsProps, fields),
                fetchLastUpdates({ type: 'slice' }),
                getHomeRecs()
            ]);

            setAnimeList({ topRated, onScreen, films });

            setLastUpdates(lastUpd as LastUpdatesT[]);
            setHomeRecs(homeRecs);
        } catch (error) {
            console.error('Ошибка при загрузке аниме:', error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        fetchAnimeLists()
    }, []);

    useEffect(() => {
        const fetchLastAnime = async () => {
            console.log('fetch last user anime');
            if (!auth.currentUser) return [];
            try {
                const last = await getLastAnime(auth.currentUser.uid);
                return last.data || []
            } catch (error) {
                console.error(error)
                return []
            }
        };

        fetchLastAnime().then((r) => setLastAnime(r));
    }, [user]);

    const refreshingFetch = async () => {
        console.log('fetch last updated and home recs', { refreshing: refreshing });
        const [rLastUpdates, rHomeRecs] = await Promise.all([
            fetchLastUpdates({ type: 'slice' }),
            getHomeRecs()
        ]);
        setLastUpdates(rLastUpdates as LastUpdatesT[]);
        setHomeRecs(rHomeRecs);
        setTimeout(() => setRefreshing(false), 4000);
    };

    useEffect(() => {
        if (!refreshing) return;
        refreshingFetch();
    }, [refreshing]);

    const handleLastAnimeUpdate = (id: number, watchedEpisodes: number) => {
        setLastAnime(prev =>
            prev.map(anime =>
                anime.id === id ? { ...anime, watchedEpisodes } : anime
            )
        );

        const anime = lastAnime.find(a => a.id === id);
        if (anime && auth.currentUser) {
            updateAnimeHistory(auth.currentUser.uid, { ...anime, watchedEpisodes }, true)
                .catch(console.error);
        }
    };

    return {
        animeList,
        loading,
        lastUpdates,
        fetchLastUpdates,
        fetch,
        refreshing,
        setRefreshing,
        lastAnime,
        handleLastAnimeUpdate,
        homeRecs
    };
}