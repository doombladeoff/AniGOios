import axios from "axios";

export const getRecommendationsYummy = async (id: number | string, limit: number | string = 10) => {
    if (!id) throw new Error('Missing ID');
    try {
        const response = await axios.get(`https://api.yani.tv/anime/${id}/recommendations?offset=0&limit=${limit}&from_ai=true`);
        return response.data.response
    } catch (error) {
        console.error(error);
        return [];
    }
}