import { storage } from "@/utils/storage";
import axios from "axios";

function buildAnimeURL(settings: {
    minRating: number;
    minAge: number[];
    status: string[];
    types: string[];
    offset?: number;
    years?: { year_to: number | null, year_from: number | null };
}) {
    const { minRating, minAge, status, types, offset = 0, years } = settings;

    const params = new URLSearchParams();

    if (minAge.length) params.append("min_age", minAge.join(","));
    if (status.length) status.forEach((s) => params.append("status", s));
    if (types.length) types.forEach((t) => params.append("types", t));
    if (minRating) params.append("min_rating", minRating.toString());
    if (years?.year_to) params.append('to_year', years.year_to.toString());
    if (years?.year_from) params.append('from_year', years.year_from.toString());

    params.append("sort_forward", "true");
    params.append("sort", "top");
    params.append("offset", offset.toString());
    params.append("limit", "4");

    return `https://api.yani.tv/anime?${params.toString()}`;
}

export const getHomeRecs = async () => {
    const offset = Math.floor(Math.random() * (100 + 1));

    let url = `https://api.yani.tv/anime?min_age=3&status=released&status=ongoing&types=tv&types=movie&min_rating=7&sort_forward=true&sort=top&offset=${offset}&limit=4`;

    const json = storage.getSaveRecommendationSettings();
    if (json) {

        console.log('js', json)
        const data = JSON.parse(json);
        const settings = {
            minRating: Number(data.minRating),
            minAge: data.minAge ? data.minAge.split(",").map(Number) : [],
            status: data.status ? data.status.split(",") : [],
            types: data.types ? data.types.split(",") : [],
            offset: offset,
            years: data.years,
        };

        url = buildAnimeURL(settings);
    }
    try {
        console.log(url)
        const res = await axios.get(url)

        return res.data.response ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
};