import { Crunchy } from "@/API/Crunchyroll/Crunchy";
// import { getLinks } from "@/constants/Links";
import { storage } from "@/utils/storage";
import { Dimensions } from "react-native";
// import UserAgent from 'user-agents';
import axios from 'axios';

const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get('screen');

export const getLinks = (crunch: string, width: number = 1680, height: number = 2520, type: 'tall' | 'wide' = 'tall') => ({
    backgroundThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=cover,format=auto,quality=85,width=${width},height=${height}/keyart/${crunch}-backdrop_${type}`,
    titleThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=600/keyart/${crunch}-title_logo-en-us`
});

// https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=cover,format=auto,quality=85,width=2300,height=1080/keyart/GNVHKN94W-backdrop_tall`

const extractCrunchyrollId = async (url: string) => {
    const match = url.match(/\/series\/([^/]+)/);
    return match ? match[1] : null;
};

const fetchCrunchy = async (link: string, token: string) => {
    // const userAgent = new UserAgent();
    try {
        const response = await axios.get(`https://${link}`, {
            headers: {
                // 'User-Agent': userAgent.toString(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Access': `Bearer ${token}`,
            },
            method: 'GET',
        });
        const id = extractCrunchyrollId(response.request.responseURL);
        return id;
    } catch (error) {
        console.error('Ошибка при получении ID Crunchyroll:', error);
        throw new Error('Ошибка получения ID Crunchyroll');
    }
};

const getCrunchyrollId = async (crunchyrollLink: any, streamingUrl: string | undefined, token: string) => {
    let crunchyrollId = null;

    if (!crunchyrollLink && !streamingUrl) {
        return crunchyrollId;
    }

    if (crunchyrollLink) {
        console.log('[Crunchyroll] Проверка на /series');
        if (crunchyrollLink.url.includes('/series/')) {
            crunchyrollId = extractCrunchyrollId(crunchyrollLink.url)
            console.log('include series =>', crunchyrollId)
        } else {
            const url = new URL(crunchyrollLink.url);
            const baseUrl = `${url.host}${url.pathname}`;
            const getId = await fetchCrunchy(baseUrl, token);
            crunchyrollId = getId ?? null;
        }
    } else {
        console.warn('[Crunchroll] Нет external ссылки, проверяем стриминг URL');
    }

    if (!crunchyrollId || crunchyrollId == null) {
        console.log('[Crunchyroll] Проверка на /watch');
        if (streamingUrl?.includes("/watch/")) {
            crunchyrollId = await extractCrunchyrollId(streamingUrl);
            console.log('Extract ID', crunchyrollId)
        }

        console.log('[Crunchyroll] Проверка на /episode');
        if (streamingUrl?.startsWith("http://www.crunchyroll.com")) {
            const url = new URL(streamingUrl);
            const episodeIndex = url.pathname.indexOf('/episode');
            const trimmedPath = episodeIndex !== -1 ? url.pathname.substring(0, episodeIndex) : url.pathname;
            const baseUrl = `${url.host}${trimmedPath}`;
            console.log('[Crunchyroll] Base URL:', { baseUrl, trimmedPath, episodeIndex });
            crunchyrollId = await fetchCrunchy(baseUrl, token);
        } else return crunchyrollId = null;
    }

    return crunchyrollId;
}

const processAnimeLinks = async (externalLinks: any, streamingUrl: string | undefined | any, token: string) => {
    if (!streamingUrl && !externalLinks) return null;

    console.log('[Crunchyroll] Procces find links');
    console.log('[Crunchyroll] Find in externalLinks');
    const crunchyrollLink = externalLinks?.find((link: any) => link.site === "Crunchyroll");
    console.log('[Crunchyroll] Find ID');
    const crunchyrollId = await getCrunchyrollId(crunchyrollLink, streamingUrl, token);

    return crunchyrollId;
};

export const getCrunchyrollIData = async (animeListData: any, malId: number): Promise<any> => {
    console.log('[Crunchyroll] Get data');
    const storageCrunchy = storage.getCrunchyroll(malId);
    if (storageCrunchy) return storageCrunchy;

    let token = '';
    const now = new Date().toISOString();
    const savedDateToken = storage.getCrunchyrollToken();
    const crunchy = new Crunchy({ email: '', password: '' });

    if (!animeListData?.externalLinks && (animeListData?.streamingEpisodes?.length < 1)) return null;

    if (!savedDateToken) {
        await crunchy.login();
        storage.setCrunchyrollToken(JSON.stringify({ token: crunchy.accessToken, time: now }))
    } else {
        let savedObj: { token: string; time: string };
        savedObj = JSON.parse(savedDateToken);

        const savedDate = new Date(savedObj.time);
        const nowDate = new Date();
        const diffMs = nowDate.getTime() - savedDate.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        if (diffMinutes >= 30) {
            console.log('[Crunchyroll] Новый токен')
            await crunchy.login();
            storage.setCrunchyrollToken(JSON.stringify({ token: crunchy.accessToken, time: now }));
            token = crunchy.accessToken ?? '';
        } else {
            console.log('[Crunchyroll] Токен ещё действителен')
            token = savedObj.token;
        }
    }

    const externalLinks = animeListData?.externalLinks;
    const streamingUrl = animeListData?.streamingEpisodes[0]?.url;
    const crunchyrollId = await processAnimeLinks(externalLinks, streamingUrl, token);
    console.log(`[Crunchyroll] ID: `, crunchyrollId, streamingUrl, externalLinks);

    if (!crunchyrollId) {
        const fallback = {
            crunchyrollId,
            crunchyAwards: {
                text: null,
                icon_url: null,
            },
            crunchyImages: { img: null },
            hasTallThumbnail: false,
            hasWideThumbnail: false,
        };

        storage.setCrunchyroll(fallback, malId);
        return fallback;
    }

    const seriesData = await crunchy.queryShowData(crunchyrollId, 'ru_RU', 'series', token)?.then(r => r.data?.[0]);
    if (!seriesData) return null;

    const posters = seriesData.images?.poster_tall?.[0];
    const img = posters?.[posters.length - 1] ?? '';

    const [thumbTall, thumbWide] = await Promise.all([
        fetch(getLinks(crunchyrollId, ScreenWidth * 3, ScreenHeight * 3, 'tall').backgroundThumbnail).then(r => r.status === 200),
        fetch(getLinks(crunchyrollId, ScreenWidth * 3, ScreenHeight * 3).titleThumbnail).then(r => r.status === 200),
    ]);
    console.log('[Crunchyroll] Has tall and wide', thumbTall, thumbWide)

    const awards = seriesData.awards ?? [];

    const crunchyData = {
        crunchyrollId,
        crunchyAwards: awards,
        crunchyImages: { img },
        hasTallThumbnail: thumbTall,
        hasWideThumbnail: thumbWide,
    };

    storage.setCrunchyroll(crunchyData, malId);
    return crunchyData;
};
