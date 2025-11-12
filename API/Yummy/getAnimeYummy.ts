import axios from "axios";

export const getAnimeYummy = async (id: number | string) => {
    if (!id) throw new Error('Missing ID');
    try {
        const response = await axios.get(`https://api.yani.tv/anime?mal_ids=${id}`);
        return response.data.response
    } catch (error) {
        console.error(error)
    }
};

export const getAnime = async (id: number | string) => {
    try {
        const response = await axios.get(`https://api.yani.tv/anime/${id}`);
        if (response.status === 200 && response.data) {
            return response.data
        }
        else
            throw new Error('Ошибка запроса');
    } catch (error) {
        console.error('[YummyAPI] Ошибка получения данных:', error);
    }
};