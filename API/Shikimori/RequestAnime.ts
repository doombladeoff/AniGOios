import { gql } from "@apollo/client";
import { client } from "../ApolloClient";
import { AnimeFields } from "./RequestFields.type";
import { RequestProps } from "./RequestInterfaces.interfaces";

export const ANIME_FIELDS: AnimeFields = {
    id: true,
    malId: true,
    name: true,
    russian: true,
    licenseNameRu: true,
    english: true,
    japanese: true,
    synonyms: true,
    kind: true,
    rating: true,
    score: true,
    status: true,
    episodes: true,
    episodesAired: true,
    duration: true,
    airedOn: { year: true, month: true, day: true, date: true },
    releasedOn: { year: true, month: true, day: true, date: true },
    url: true,
    season: true,
    poster: { id: true, originalUrl: true, mainUrl: true, main2xUrl: true },
    fansubbers: true,
    fandubbers: true,
    licensors: true,
    createdAt: true,
    updatedAt: true,
    nextEpisodeAt: true,
    isCensored: true,
    genres: { id: true, name: true, russian: true, kind: true },
    studios: { id: true, name: true, imageUrl: true },
    externalLinks: { id: true, kind: true, url: true, createdAt: true, updatedAt: true },
    personRoles: {
        id: true,
        rolesRu: true,
        rolesEn: true,
        person: { id: true, name: true, poster: { id: true } }
    },
    characterRoles: {
        id: true,
        rolesRu: true,
        rolesEn: true,
        character: { id: true, name: true, russian: true, poster: { id: true, mainUrl: true } }
    },
    related: {
        id: true,
        anime: { id: true, name: true },
        manga: { id: true, name: true },
        relationKind: true,
        relationText: true
    },
    videos: {
        id: true,
        url: true,
        name: true,
        kind: true,
        playerUrl: true,
        imageUrl: true,
    },
    screenshots: { id: true, originalUrl: true, x166Url: true, x332Url: true },
    scoresStats: { score: true, count: true },
    statusesStats: { status: true, count: true },
    description: true,
};

export function buildFields(fieldsObj: any): string {
    return Object.entries(fieldsObj)
        .filter(([, v]) => v && (v === true || (typeof v === 'object' && Object.keys(v).length > 0)))
        .map(([k, v]) =>
            v === true
                ? k
                : `${k} { ${buildFields(v)} }`
        )
        .join("\n");
}

export function buildAnimeQueryFromObject(fieldsObj: any) {
    return gql`
    query GetAnime(
      $search: String
      $ids: String
      $kind: AnimeKindString
      $status: AnimeStatusString
      $limit: Int!
      $order: OrderEnum
      $duration: DurationString
      $rating: RatingString
      $page: Int!
      $season: SeasonString
      $genre: String
      $score: Int
    ) {
      animes(
        search: $search
        ids: $ids
        kind: $kind
        status: $status
        limit: $limit
        order: $order
        duration: $duration
        rating: $rating
        page: $page
        season: $season
        genre: $genre
        score: $score
      ) {
        ${buildFields(fieldsObj)}
      }
    }
  `;
}

function buildVariables(props: RequestProps) {
    const {
        name,
        ids,
        kind,
        status,
        limit = 10,
        order,
        duration,
        rating,
        page = 1,
        season,
        genre,
        score,
    } = props;

    const adjustedLimit = Math.min(Math.max(limit, 1), 50);

    return {
        ...(name && { search: name }),
        ...(ids && { ids }),
        ...(kind?.length && { kind: kind.join(",") }),
        ...(status?.length && { status: status.join(",") }),
        ...(duration?.length && { duration: duration.join(",") }),
        ...(rating?.length && { rating: rating.join(",") }),
        ...(!ids && { order: order }),
        ...(season?.length && { season }),
        ...(genre?.length && { genre: genre.join(",") }),
        limit: adjustedLimit,
        page,
        ...(score && { score }),
    };
}

export const getAnimeList = async (
    props: RequestProps,
    fieldsObj: AnimeFields = ANIME_FIELDS,
    apolloClient?: any
) => {
    const variables = buildVariables(props);
    console.log(variables)
    try {
        const { data } = await (apolloClient || client).query({
            query: buildAnimeQueryFromObject(fieldsObj),
            variables,
        });
        return data.animes;
    } catch (error) {
        console.error("Error fetching anime list:", error);
        return [];
    }
};

