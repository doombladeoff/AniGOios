import axios from "axios";

export const getRecommendationsById = async (shikimori_id: number | string) => {
    try {
        const response = await axios.get(`https://shikimori.one/api/animes/${shikimori_id}/similar`);
        return response.data;
    } catch (error) {
        console.error('[Shikimori API] Ошибка получения рекомендаций: ', error);
        return [];
    };
};