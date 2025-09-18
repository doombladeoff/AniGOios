import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

const EPISODE_KEY_PREFIX = "last-episode-";
const CASTER_KEY_PREFIX = "last-caster-";
const FAVORITE_KEY_PREFIX = "favorite";
const SKIP_KEY = "skip";
const CRUNCHYROLL_KEY = "CRUNCHYROLL_byMal";
const ANIMEASSETS_KEY = 'ANIME_ASSETS_';


export const storage = {
    // AUTH
    setToken: (key: string, token: string) => mmkv.set(key, token),
    getToken: (key: string) => mmkv.getString(key),
    deleteToken: (key: string) => mmkv.delete(key),
    setSkip: (value: boolean) => mmkv.set(SKIP_KEY, value),
    getSkip: () => mmkv.getBoolean(SKIP_KEY),

    //SETTINGS
    setSkipOpening: (value: boolean) => mmkv.set('SKIP_OPENING', value),
    getSkipOpening: () => mmkv.getBoolean('SKIP_OPENING'),
    setShowComments: (value: boolean) => mmkv.set('SHOW_COMM', value),
    getShowComments: () => mmkv.getBoolean('SHOW_COMM'),
    setUseToast: (value: boolean) => mmkv.set('USE_TOAST', value),
    getUseToast: () => mmkv.getBoolean('USE_TOAST'),
    setUseTestHeader: (value: boolean) => mmkv.set('USE_TEST_HEADER', value),
    getUseTestHeader: () => mmkv.getBoolean('USE_TEST_HEADER'),

    //Settings Recommendations
    setShowHomeRecs: (value: boolean) => mmkv.set('SHOW_HOME_RECS', value),
    getShowHomeRecs: () => mmkv.getBoolean('SHOW_HOME_RECS'),
    setSaveRecommendationSettings: (value: {}) => mmkv.set('HOME_RECS_SETTINGS', JSON.stringify(value)),
    getSaveRecommendationSettings: () => mmkv.getString('HOME_RECS_SETTINGS'),


    // Settings poster
    setCrunchyPoster: (value: boolean) => mmkv.set('Crunchy_POSTER', value),
    getCrunchyPoster: () => mmkv.getBoolean('Crunchy_POSTER'),

    set3DPoster: (value: boolean) => mmkv.set('3D_POSTER', value),
    get3DPoster: () => mmkv.getBoolean('3D_POSTER'),

    setDefaultTabBar: (value: boolean) => mmkv.set('DEF_TABS', value),
    getDefaultTabBar: () => mmkv.getBoolean('DEF_TABS'),
    setUseTitleBottomTabs: (value: boolean) => mmkv.set('USE_TITLE_BOTTOM_TAB', value),
    getUseTitleBottomTabs: () => mmkv.getBoolean('USE_TITLE_BOTTOM_TAB'),

    setShowStatus: (value: boolean) => mmkv.set('POSTER_STATUS', value),
    getShowStatus: () => mmkv.getBoolean('POSTER_STATUS'),

    setHomeAnimeInfo: (value: boolean) => mmkv.set('HOME_ANIME_INFO', value),
    getHomeAnimeInfo: () => mmkv.getBoolean('HOME_ANIME_INFO'),

    //Player
    setDefaultPlayer: (value: boolean) => mmkv.set('DEF_PLAYER', value),
    getDefaultPlayer: () => mmkv.getBoolean('DEF_PLAYER'),
    setQuality: (value: string) => mmkv.set('QUALITY', value),
    getQuality: () => mmkv.getString('QUALITY'),
    setSkipTime: (value: number) => mmkv.set('SKIPTIME', value),
    getSkipTime: () => mmkv.getNumber('SKIPTIME'),
    setSaveEpisodeTime: (value: boolean) => mmkv.set('USE_SAVE_TIME', value),
    getSaveEpisodeTime: () => mmkv.getBoolean('USE_SAVE_TIME'),

    //Episodes
    /**
     * Сохраняет последний просмотренный эпизод.
     * 
     * @param key - уникальный идентификатор (id аниме)
     * @param value - значение (indx)
     */
    setLastViewEpisode: (key: string, value: string) => mmkv.set(`${EPISODE_KEY_PREFIX}$${key}`, value),
    getLastViewEpisode: (key: string) => mmkv.getString(`${EPISODE_KEY_PREFIX}$${key}`),

    setSavedEpisodeTime: (value: number, episodeNumber: string | number, animeId: string | number) => mmkv.set(`EPISODE_TIME-${episodeNumber}-${animeId}`, value),
    getSavedEpisodeTime: (episodeNumber: string | number, animeId: string | number) => mmkv.getNumber(`EPISODE_TIME-${episodeNumber}-${animeId}`),

    //VoiceOvers
    /**
     * Сохраняет последний просмотренный эпизод.
     * 
     * @param key - уникальный идентификатор (id аниме)
     * @param value - значение (indx)
     */
    setSavedVoiceOvers: (key: string, value: string) => mmkv.set(`SavedVoice-${key}`, value),
    getSavedVoiceOvers: (key: string) => mmkv.getString(`SavedVoice-${key}`),


    //Casters
    setEpisodeCaster: (key: string, value: string) => mmkv.set(`${CASTER_KEY_PREFIX}$${key}`, value),
    getEpisodeCaster: (key: string) => mmkv.getString(`${CASTER_KEY_PREFIX}$${key}`),

    //CRUNCHYROLL
    setCrunchyrollToken: (v: any) => mmkv.set(`CrunchyToken`, v),
    getCrunchyrollToken: () => mmkv.getString(`CrunchyToken`),
    setCrunchyroll: (data: any, id: number) => {
        try {
            const jsonString = JSON.stringify(data);
            mmkv.set(`${CRUNCHYROLL_KEY}${id}`, jsonString);
        } catch (error) {
            console.error('Ошибка при сохранении данных Crunchyroll:', error);
        }
    },
    getCrunchyroll: (id: number) => {
        try {
            const jsonString = mmkv.getString(`${CRUNCHYROLL_KEY}${id}`);
            if (jsonString) {
                return JSON.parse(jsonString);
            }
            return null;
        } catch (error) {
            console.error('Ошибка при получении данных Crunchyroll:', error);
            return null;
        }
    },

    //ASSETS
    setAnimeAssets: (data: any, id: number) => {
        try {
            const jsonString = JSON.stringify(data);
            mmkv.set(`${ANIMEASSETS_KEY}${id}`, jsonString);
        } catch (error) {
            console.error('Ошибка при сохранении данных ассетов:', error);
        }
    },
    getAnimeAssets: (id: number) => {
        try {
            const jsonString = mmkv.getString(`${ANIMEASSETS_KEY}${id}`);
            if (jsonString) {
                return JSON.parse(jsonString);
            }
            return null;
        } catch (error) {
            console.error('Ошибка при получении данных ассетов:', error);
            return null;
        }
    },

    //Favorites
    // saveFavorites: (array: FavoriteItem[]): boolean => {
    //     try {
    //         const jsonString = JSON.stringify(array);
    //         mmkv.set(FAVORITE_KEY_PREFIX, jsonString);
    //         return true;
    //     } catch (error) {
    //         console.error('Ошибка при сохранении массива избранного:', error);
    //         return false;
    //     }
    // },

    // getFavorites: (): FavoriteItem[] | null => {
    //     try {
    //         const jsonString = mmkv.getString(FAVORITE_KEY_PREFIX);
    //         if (jsonString) {
    //             return JSON.parse(jsonString) as FavoriteItem[];
    //         }
    //         return null;
    //     } catch (error) {
    //         console.error('Ошибка при получении массива избранного:', error);
    //         return null;
    //     }
    // },

    // checkIsFavorite: (keyToCheck: string | number): boolean => {
    //     try {
    //         const currentFavorites = storage.getFavorites();
    //         if (currentFavorites) {
    //             return currentFavorites.some(item => item.id === keyToCheck);
    //         }
    //         return false;
    //     } catch (error) {
    //         console.error('Ошибка при проверке наличия в избранном:', error);
    //         return false;
    //     }
    // },

    // addFavorite: (item: FavoriteItem): boolean => {
    //     try {
    //         const currentFavorites = storage.getFavorites() || [];
    //         const updatedFavorites = [...currentFavorites, item];
    //         return storage.saveFavorites(updatedFavorites);
    //     } catch (error) {
    //         console.error('Ошибка при добавлении в избранное:', error);
    //         return false;
    //     }
    // },

    // removeFavorite: (idToRemove: string | number): boolean => {
    //     try {
    //         const currentFavorites = storage.getFavorites();
    //         if (currentFavorites) {
    //             const updatedFavorites = currentFavorites.filter(item => item.id !== idToRemove);
    //             return storage.saveFavorites(updatedFavorites);
    //         }
    //         return false;
    //     } catch (error) {
    //         console.error('Ошибка при удалении из избранного по ID:', error);
    //         return false;
    //     }
    // },

    clearALL: () => {
        return mmkv.clearAll();
    }

};