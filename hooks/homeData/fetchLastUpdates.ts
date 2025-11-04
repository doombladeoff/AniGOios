import { getLastUpdatets } from "@/API/Kodik/getLatestUpdatets";
import { todayString, yesterdayString } from "@/utils/getDate";
import { MaterialObject } from "kodikwrapper";

type SliceResult = any[];
type FullResult = { result1: MaterialObject[]; result2: MaterialObject[] };

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

                return filtered.slice(0, 10)

            case 'full':
                const today = response.filter((i) => i.updated_at.startsWith(todayString));
                const yesterday = response.filter((i) => i.updated_at.startsWith(yesterdayString));

                return { result1: today, result2: yesterday }
            default:
                return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};
