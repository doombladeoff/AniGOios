import { useAnimeStore } from "@/store/animeStore";

export const useAnimeStoreById = (id: number) => {
    const state = useAnimeStore.getState();

    return {
        anime: state.animeMap[id],
        setAnime: (data: any) => state.setAnimeById(id, data),
        Poster3D: state.Poster3DMap[id],
        setPoster3D: (v: boolean) => state.setPoster3DById(id, v),
        useCrunch: state.useCrunchMap[id],
        setUseCrunch: (v: boolean) => state.setUseCrunchById(id, v),
        postersArr: state.postersArrMap[id],
        setPostersArr: (v: any[]) => state.setPostersArrById(id, v),
        hasTall: state.hasTallMap[id],
        setHasTall: (v: boolean) => state.setHasTallById(id, v),
        hasWide: state.hasWideMap[id],
        setHasWide: (v: boolean) => state.setHasWideById(id, v),
        crunchyDefPoster: state.crunchyDefPosterMap[id],
        setCrunchyDefPoster: (v: string) => state.setCrunchyDefPosterById(id, v),
        fallbackImage: state.fallbackImageMap[id],
        setFallbackImage: (v: string) => state.setFallbackImageById(id, v),
        isLoad: state.isLoadMap[id],
        setIsLoad: (v: boolean) => state.setIsLoadById(id, v),
    };
};
