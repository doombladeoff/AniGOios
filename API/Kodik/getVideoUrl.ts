import { parseSkipTime } from "@/utils/playerHelper";
import { storage } from "@/utils/storage";
import { getLinksWithActualEndpoint } from "./getLinksWithActualEndpoint";

const qualityIndex = storage.getQuality() ?? 0;

export const getVideoUrl = async (episode: string, episodeList: any) => {
    const links = await getLinksWithActualEndpoint(episode, episodeList);
    const link = links?.[qualityIndex as number];

    if (!link) return;

    let skipT: { start: number; end: number } = { start: 0, end: 0 };
    if (link.skipTime)
        skipT = parseSkipTime(link.skipTime);
    const url = link.url?.startsWith("https:") ? link.url : `https:${link.url}`;
    return {
        url,
        skip: skipT
    };
};
