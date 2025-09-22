import { Client, SearchParams } from "kodikwrapper";

export const getEpisodes = async (token: string, id: number, translation_id: number) => {
    try {
        if (!token || token === '') throw new Error('Ошибка токена');

        const client = Client.fromToken(token);
        const params: SearchParams = {
            shikimori_id: id,
            episode: 0,
            translation_id: translation_id,
        };
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value != null)
        );
        const voiceDataById = await client.search(cleanedParams);

        const lastSeason = voiceDataById.results[0]?.last_season || 0
        const obj: any = [{
            caster: voiceDataById.results[0]?.translation.title,
            episodes:
                voiceDataById.results[0]?.seasons?.[lastSeason]?.episodes ||
                voiceDataById.results[0]?.link || {}
        }];

        const objList = typeof obj?.[0]?.episodes === "object"
            ? obj[0].episodes
            : { 1: obj?.[0]?.episodes || {} };

        return objList;
    } catch (error) {
        console.error('[KODIK API ERROR]: ', error)
        return {};
    }
}