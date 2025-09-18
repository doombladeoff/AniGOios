import { gql } from "@apollo/client";
import anilistClient from "./anilistClient";

export const GET_ANIME_BY_MAL_ID = gql`
  query ($id: Int) {
    Media(idMal: $id, type: ANIME) {
        episodes
        siteUrl
        streamingEpisodes {
        title
        thumbnail
        }
    }
  }
`;

export const getEpisodesData = async (id: number) => {
    try {
        const { data } = await anilistClient.query({
            query: GET_ANIME_BY_MAL_ID,
            variables: { id, },
        });
        console.log('FETCT', data.Media)
        return data?.Media ?? [];
    } catch (err) {
        console.error("AniList API error:", err);
        return null;
    }
};