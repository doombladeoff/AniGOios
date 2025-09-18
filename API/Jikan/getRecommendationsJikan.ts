import axios from "axios";

export const getRecommendationsJikan = async (id: number | string) => {
    if (!id) throw new Error('Missing ID');
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        return response.data.data.slice(0, 10);
    } catch (error) {
        console.error(error);
        return [];
    }
}