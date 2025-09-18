import { getAnimeList } from '@/API/Shikimori/RequestAnime';
import { AnimeKindEnum } from '@/API/Shikimori/Shikimori.types';
import { create } from 'zustand';

export enum AnimeGenre { AvantGarde = 5, Gourmet = 543, Drama = 8, Comedy = 4, SliceOfLife = 36, Adventure = 2, Romance = 22, Supernatural = 37, Sports = 30, Mystery = 7, Suspense = 117, Horror = 14, SciFi = 24, Fantasy = 10, Action = 1, Ecchi = 9, }
export const GenreOptions = [{ value: AnimeGenre.AvantGarde, label: "Авангард" }, { value: AnimeGenre.Gourmet, label: "Гурман" }, { value: AnimeGenre.Drama, label: "Драма" }, { value: AnimeGenre.Comedy, label: "Комедия" }, { value: AnimeGenre.SliceOfLife, label: "Повседневность" }, { value: AnimeGenre.Adventure, label: "Приключения" }, { value: AnimeGenre.Romance, label: "Романтика" }, { value: AnimeGenre.Supernatural, label: "Сверхъестественное" }, { value: AnimeGenre.Sports, label: "Спорт" }, { value: AnimeGenre.Mystery, label: "Детектив" }, { value: AnimeGenre.Suspense, label: "Саспенс" }, { value: AnimeGenre.Horror, label: "Ужасы" }, { value: AnimeGenre.SciFi, label: "Фантастика" }, { value: AnimeGenre.Fantasy, label: "Фэнтези" }, { value: AnimeGenre.Action, label: "Экшен" }, { value: AnimeGenre.Ecchi, label: "Этти" },];

interface SearchState {
    query: string;
    page: number;
    results: any[];
    isLoading: boolean;
    lockFetch: boolean;

    // фильтры
    kind: AnimeKindEnum[];
    genres: string[];
    yearRange: { from: number; to: number };
    sort: "ranked" | "name";

    // set
    setQuery: (q: string) => void;
    setKind: (k: AnimeKindEnum[]) => void;
    toggleKind: (k: AnimeKindEnum) => void;
    setGenres: (g: string[]) => void;
    toggleGenre: (g: AnimeGenre) => void;
    setYearRange: (from: number, to: number) => void;
    setSort: (s: "ranked" | "name") => void;

    // поиск
    apply: () => void;
    reset: () => void;
    resetFilter: () => void;
    fetchResults: (reset?: boolean) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
    query: "",
    page: 1,
    results: [],
    isLoading: false,
    lockFetch: false,

    kind: [AnimeKindEnum.tv, AnimeKindEnum.movie],
    genres: [],
    yearRange: { from: 2000, to: new Date().getFullYear() },
    sort: "ranked",

    setQuery: (q) => set({ query: q }),
    setKind: (k) => set({ kind: k }),
    toggleKind: (k) => {
        const { kind } = get();
        set({ kind: kind.includes(k) ? kind.filter(x => x !== k) : [...kind, k] });
    },
    setGenres: (g) => set({ genres: g }),
    toggleGenre: (g) => {
        const str = String(g);
        const { genres } = get();
        set({ genres: genres.includes(str) ? genres.filter(x => x !== str) : [...genres, str] });
    },
    setYearRange: (from, to) => set({ yearRange: { from, to } }),
    setSort: (s) => set({ sort: s }),

    apply: () => {
        set({
            page: 1,
            results: [],
            lockFetch: false,
        });
    },
    reset: () => {
        set({
            page: 1,
            results: [],
            lockFetch: false,
            genres: [],
            kind: [AnimeKindEnum.tv, AnimeKindEnum.movie],
        });
    },
    resetFilter: () => {
        set({
            sort: 'ranked',
            genres: [],
            kind: [AnimeKindEnum.tv, AnimeKindEnum.movie],
            yearRange: { from: 2000, to: new Date().getFullYear() },
        });
    },

    fetchResults: async (reset = false) => {
        const state = get();
        if (state.isLoading || state.lockFetch) return;

        if (reset) {
            set({ page: 1, results: [], lockFetch: false });
        }

        set({ isLoading: true });

        const correctSeason = () => {
            let payload = `!ancient`;
            const { from, to } = state.yearRange;
            if (from > 0 && to > 0) payload += `,${from}_${to}`;
            else if (from > 0) payload += `,${from}`;
            else if (to > 0) payload += `,${to}`;
            return payload;
        };

        try {
            const response = await getAnimeList(
                {
                    name: state.query,
                    page: state.page,
                    limit: 10,
                    kind: state.kind,
                    order: state.sort,
                    season: correctSeason(),
                    genre: state.genres,
                    rating: ['pg_13', 'r', 'r_plus']
                },
                {
                    id: true,
                    malId: true,
                    poster: { main2xUrl: true, mainUrl: true },
                    russian: true,
                    score: true,
                    description: true,
                    genres: { id: true, russian: true },
                    kind: true
                }
            );

            if (response.length === 0) {
                set({ lockFetch: true });
            } else {
                //сортировка по score (не работает при пагинации)
                // const sortedResponse = [...response].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

                // set({
                //     results: reset ? sortedResponse : [...state.results, ...sortedResponse],
                //     page: state.page + 1,
                // });
                set({
                    results: reset ? response : [...state.results, ...response],
                    page: state.page + 1,
                });
            }
        } finally {
            set({ isLoading: false });
        }
    }
}));
