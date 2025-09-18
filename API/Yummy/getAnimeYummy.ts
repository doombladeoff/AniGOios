import axios from "axios";

export const getAnimeYummy = async (id: number | string) => {
    if (!id) throw new Error('Missing ID');
    try {
        const response = await axios.get(`https://api.yani.tv/anime?mal_ids=${id}`);
        return response.data.response
    } catch (error) {
        console.error(error)
    }
}