import { Client, SearchParams } from "kodikwrapper";

export const getVoiceOvers = async (token: string, id: number) => {
    try {
        if (!token || token === '') throw new Error('Ошибка токена');

        const client = new Client({ token });

        const params: SearchParams = {
            shikimori_id: id,
            episode: 0,
        };
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value != null)
        );

        const voiceData = await client.search(cleanedParams);
        const translations = voiceData.results.map(item => item.translation).filter(Boolean);
        console.log(translations)

        return translations || [];
    } catch (error) {
        console.log('[KODIK API ERROR]: ', error);
        return [];
    }
}