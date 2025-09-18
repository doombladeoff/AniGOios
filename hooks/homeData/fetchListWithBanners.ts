import { getAnimeByMalId } from "@/API/Anilist/test";
import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";

function mergeBannerImages(list: any[], bannerList: any[]) {
    const bannerMap = Object.fromEntries(
        bannerList.map((item) => [Number(item.idMal), item.bannerImage])
    );

    return list.map((item) => ({
        ...item,
        bannerImage: bannerMap[Number(item.malId)] ?? null,
    }));
};

export async function fetchListWithBanners(props: any, fields: AnimeFields) {
    const list = await getAnimeList(props, fields);
    const malIds = list.map((item: any) => Number(item.malId));
    const aniListData = await getAnimeByMalId(malIds);
    return mergeBannerImages(list, aniListData);
};