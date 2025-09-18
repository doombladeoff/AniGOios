import { storage } from "../storage";

export enum MinAge {
    "PG" = 1,
    "PG-13" = 2,
    "R-17" = 3,
    "R" = 4,
}

export type Status = "released" | "ongoing" | "announce";
export const statusLabel: Record<Status, string> = {
    released: "Вышло",
    ongoing: "Выходит",
    announce: "Анонс",
};

export type Types = "tv" | "movie" | "shortfilm" | "ova" | "ona";
export const typeLabels: Record<Types, string> = {
    tv: "ТВ",
    movie: "Фильм",
    shortfilm: "Короткометражка",
    ova: "OVA",
    ona: "ONA",
};

export interface RecommendationSettings {
    minRating: number;
    minAge: number[];
    status: Status[];
    types: Types[];
    years?: {
        year_to: number | null;
        year_from: number | null;
    } | null;
}

export const saveRecommendationSettings = async (settings: RecommendationSettings) => {
    const dataToSave = {
        minRating: settings.minRating,
        minAge: settings.minAge.join(","),
        status: settings.status.join(","),
        types: settings.types.join(","),
        years: settings.years,
    };
    const data = JSON.stringify(dataToSave);
    console.log(dataToSave, '\n\n', JSON.parse(data));
    try {
        const dataToSave = {
            minRating: settings.minRating,
            minAge: settings.minAge.join(","),
            status: settings.status.join(","),
            types: settings.types.join(","),
            years: settings.years,
        };
        storage.setSaveRecommendationSettings(dataToSave);
        console.log("Настройки сохранены в MMKV");
    } catch (error) {
        console.error("Ошибка при сохранении в MMKV", error);
    }
};

export const loadRecommendationSettings = (): RecommendationSettings | null => {
    try {
        const json = storage.getSaveRecommendationSettings();
        if (!json) return null;

        const data = JSON.parse(json);
        return {
            minRating: Number(data.minRating),
            minAge: data.minAge ? data.minAge.split(",").map(Number) : [],
            status: data.status ? data.status.split(",") : [],
            types: data.types ? data.types.split(",") : [],
            years: data.years ? data.years : null,
        };
    } catch (error) {
        console.error("Ошибка при загрузке из MMKV", error);
        return null;
    }
};