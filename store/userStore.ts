import { User } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore';
import { create } from 'zustand';

export interface Folder {
    name: string;
    anime: number[];
    color: string;
}
export interface Rang {
    level: number;
    exp: number;
}

export interface WatchStats {
    watchTime: number;
    watchedEpisodes: number;
}

export interface LastAnime {
    totalEpisodes: number;
    watchedEpisodes: number;
    title: string;
    poster: string;
    id: number;
    createdAt?: string | FieldValue;
}

export interface CustomUser extends User {
    avatarURL: string;
    bannerURL: string;
    yummyToken: string;
    yummyTokenDate: string;
    friends: [];
    folders: Folder[];
    rang: Rang;
    watchStats: WatchStats;
    lastAnime: LastAnime | null;
}

interface UserStore {
    user: CustomUser | null | undefined,
    setUser: (v: CustomUser | null) => void,
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,

    setUser: (v) => {
        set({ user: v })
    }

}));