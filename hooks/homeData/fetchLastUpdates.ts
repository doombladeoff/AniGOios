import { getLastUpdatets } from "@/API/Kodik/getLatestUpdatets";
import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { todayString, yesterdayString } from "@/utils/getDate";

type PosterField =
    | "originalUrl"
    | "mainUrl"
    | "main2xUrl"
    | "mainAltUrl"
    | "mainAlt2xUrl"
    | "miniUrl";

// добавляем к объектам поле poster
const attachPosters = (items: any[], images: any[], field: PosterField) => {
    const imageMap = new Map(
        images.map((img: any) => [String(img.id), img.poster?.[field] || null])
    );

    return items.map((item) => ({
        ...item,
        id: String(item.shikimori_id),
        poster: {
            originalUrl: imageMap.get(String(item.shikimori_id)) || null,
        },
    }));
};

// достаём из списка аниме картинки по id
const fetchWithImages = async (items: any[], field: PosterField) => {
    if (!items.length) return [];

    const ids = items.map((i) => String(i.shikimori_id)).join(", ");
    const images = await getAnimeList(
        { ids, limit: 50 },
        { poster: { [field]: true }, id: true }
    );

    return attachPosters(items, images, field);
};

type SliceResult = any[];
type FullResult = { result1: any[]; result2: any[] };

type FetchLastUpdatesReturn = SliceResult | FullResult;

interface FetchLastUpdatesProps {
    type?: "slice" | "full";
    limit?: number;
}

export const fetchLastUpdates = async (
    { type, limit }: FetchLastUpdatesProps
): Promise<FetchLastUpdatesReturn> => {
    try {
        const response = await getLastUpdatets(process.env.EXPO_PUBLIC_KODIK_TOKEN!, limit);
        if (!response) return [];

        switch (type) {
            case 'slice':
                let filtered = response.filter((item) => item.updated_at.startsWith(todayString) && item.shikimori_id);
                if (filtered.length < 1) {
                    filtered = response.filter((item) => item.updated_at.startsWith(yesterdayString) && item.shikimori_id);
                }

                const result = await fetchWithImages(filtered, 'originalUrl');
                return result.slice(0, 10);

            case 'full':
                const today = response.filter((i) => i.updated_at.startsWith(todayString));
                const yesterday = response.filter((i) => i.updated_at.startsWith(yesterdayString));

                const [result1, result2] = await Promise.all([fetchWithImages(today, 'mainUrl'), fetchWithImages(yesterday, 'mainUrl')]);

                return { result1, result2 };

            default:
                return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};
