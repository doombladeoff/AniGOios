import { favoriteVoiceOversID } from "@/constants/FavoriteVoiceoversID";
import { Client } from "kodikwrapper";

export const getLastUpdatets = async (token: string, limit?: number) => {
    try {
        if (!token || token === '') throw new Error('Ошибка токена');

        const client = Client.fromToken(token);
        const lastUpdates = await client.list({ limit: limit ? limit : 20, translation_type: 'voice', types: 'anime-serial', translation_id: favoriteVoiceOversID });

        return lastUpdates.results;
    } catch (error) {
        console.error('[KODIK API ERROR]: ', error);
        return [];
    }
}