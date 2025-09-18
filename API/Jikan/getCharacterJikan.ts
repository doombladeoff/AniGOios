import axios from "axios";

/** @param id  - My AnimeList ID (malId) */
export const getCharacterJikan = async (id: number | string) => {
    try {
        console.log(id)
        const response = await axios.get(`https://api.jikan.moe/v4/characters/${id}/full`);
        return response.data.data;
    } catch (error) {
        console.error('Jikan API Error:', error)
    }
}