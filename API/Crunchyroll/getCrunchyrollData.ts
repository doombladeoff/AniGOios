import { Crunchy } from "@/API/Crunchyroll/Crunchy";
import { storage } from "@/utils/storage";
import axios from 'axios';
import { Dimensions } from "react-native";

const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get('screen');

interface CrunchyrollAward {
    text: string | null;
    icon_url: string | null;
}

export interface CrunchyrollData {
    crunchyrollId: string | null;
    crunchyAwards: CrunchyrollAward[] | {
        text: null;
        icon_url: null
    };
    crunchyImages: {
        poster: string | null,
        tallThumbnail: string | null,
        wideThumbnail: string | null,
        titleLogo: string | null,
    };
    hasTallThumbnail: boolean;
    hasWideThumbnail: boolean;
}

interface ExternalLink {
    site: string;
    url: string;
}

interface StreamingEpisode {
    url: string;
}

interface AnimeListData {
    externalLinks: ExternalLink[];
    streamingEpisodes: StreamingEpisode[];
}

interface LinksProps {
    crunch: string,
    width?: number,
    height?: number,
    type: 'tall' | 'wide'
}
export const getLinks = ({ crunch, width = 1680, height = 2520, type = 'tall' }: LinksProps) => ({
    backgroundThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=cover,format=auto,quality=85,width=${width},height=${height}/keyart/${crunch}-backdrop_${type}`,
    titleThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=600/keyart/${crunch}-title_logo-en-us`
});

const extractCrunchyrollId = (url: string) => {
    const match = url.match(/\/series\/([^/]+)/);
    return match ? match[1] : null;
};

const fetchCrunchy = async (link: string, token: string) => {
    try {
        const response = await axios.get(`https://${link}`, {
            headers: {
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
            crunchyrollId = extractCrunchyrollId(streamingUrl);
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

async function getValidToken(crunchy: Crunchy): Promise<string> {
    try {
        const now = Date.now();
        const savedToken = storage.getCrunchyrollToken();

        const saveToken = async () => {
            await crunchy.login();
            const token = crunchy.accessToken!;
            storage.setCrunchyrollToken(JSON.stringify({ token, time: now }));
            return token;
        };

        if (!savedToken) return await saveToken();

        const { token, time } = JSON.parse(savedToken) as { token: string; time: number };
        if (now - time >= 30 * 60 * 1000) return await saveToken();

        return token;
    } catch (error) {
        console.error('[Crunchyroll] Ошибка токена:', error);
        return '';
    }

}

async function checkImage(url: string): Promise<boolean> {
    try {
        const res = await fetch(url,
            {
                method: "HEAD"
            });
        return res.ok;
    } catch {
        return false;
    }
};

export const getCrunchyrollIData = async (animeListData: AnimeListData, malId: number): Promise<CrunchyrollData> => {
    const fallback: CrunchyrollData = {
        crunchyrollId: null,
        crunchyAwards: {
            text: null,
            icon_url: null,
        },
        crunchyImages: {
            poster: null,
            tallThumbnail: null,
            wideThumbnail: null,
            titleLogo: null,
        },
        hasTallThumbnail: false,
        hasWideThumbnail: false,
    };

    if (!animeListData?.externalLinks && (animeListData?.streamingEpisodes?.length < 1)) return fallback;

    console.log('[Crunchyroll] Get data');
    const cached = storage.getCrunchyroll(malId);
    if (cached) {
        console.log('[Crunchyroll] Return stored data');
        return cached
    };

    const crunchy = new Crunchy({ email: '', password: '' });
    const token = await getValidToken(crunchy);

    try {
        const externalLinks = animeListData?.externalLinks;
        const streamingUrl = animeListData?.streamingEpisodes[0]?.url;
        const crunchyrollId = await processAnimeLinks(externalLinks, streamingUrl, token);
        console.log(`[Crunchyroll] ID: `, crunchyrollId, streamingUrl, externalLinks);

        if (!crunchyrollId) {
            storage.setCrunchyroll(fallback, malId);
            return fallback;
        }

        const seriesData = await crunchy.queryShowData(crunchyrollId, 'ru_RU', 'series', token)?.then(r => r.data?.[0]);
        if (!seriesData) return fallback;

        const posters = seriesData.images?.poster_tall?.[0];
        const img = posters?.[posters.length - 1] ?? null;

        const [hasTallThumbnail, hasWideThumbnail, hasTitleLogo] = await Promise.all([
            checkImage(getLinks({ crunch: crunchyrollId, type: 'tall' }).backgroundThumbnail),
            checkImage(getLinks({ crunch: crunchyrollId, type: 'wide' }).backgroundThumbnail),
            checkImage(getLinks({ crunch: crunchyrollId, type: 'tall' }).titleThumbnail)
        ]);
        console.log('[Crunchyroll] Has tall and wide', hasTallThumbnail, hasWideThumbnail)

        const awards = seriesData.awards ?? [];

        const crunchyData: CrunchyrollData = {
            crunchyrollId,
            crunchyAwards: awards,
            crunchyImages: {
                poster: img,
                tallThumbnail: hasTallThumbnail ? getLinks({ crunch: crunchyrollId, width: ScreenWidth * 3, height: ScreenHeight * 3, type: 'tall' }).backgroundThumbnail : null,
                wideThumbnail: hasWideThumbnail ? getLinks({ crunch: crunchyrollId, width: ScreenWidth * 5, height: ScreenHeight * 3, type: 'wide' }).backgroundThumbnail : null,
                titleLogo: hasTitleLogo ? getLinks({ crunch: crunchyrollId, type: 'tall' }).titleThumbnail : null,
            },
            hasTallThumbnail,
            hasWideThumbnail,
        };

        storage.setCrunchyroll(crunchyData, malId);
        return crunchyData;
    } catch (error) {
        console.error('[Crunchyroll] Ошибка:', error);
        return fallback;
    }
};
