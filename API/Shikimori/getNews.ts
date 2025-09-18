import axios from "axios";

export const getNews = async (limit: number, page: number) => {
    try {
        const response = await axios.get(`https://shikimori.one/api/topics?forum=news&limit=${limit}&page=${page}`);
        return response.data;
    } catch (error) {
        console.log('SHIKIMORI API FORUM ERROR: ', error);
    }
}