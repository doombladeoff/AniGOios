import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { create } from "zustand";

interface AnimeState {
    animeMap: Record<number, ShikimoriAnime>;

    setAnimeById: (id: number, data: any) => void;
    clearAnimeMap: () => void;
}

export const useAnimeStore = create<AnimeState>((set, get) => ({
    animeMap: {},

    setAnimeById: (id, data) =>
        set((state) => ({ animeMap: { ...state.animeMap, [id]: data } })),

    clearAnimeMap: () => set({ animeMap: {} }),
}));
