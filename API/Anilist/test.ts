import { gql } from "@apollo/client";
import anilistClient from "./anilistClient";

export const GET_ANIME_BY_MAL_ID = gql`
  query ($ids: [Int]) {
   Page(perPage: 20) {
    media(idMal_in: $ids, type: ANIME) {
      idMal
      bannerImage
    }
  }
  }
`;

export const getAnimeByMalId = async (ids: any) => {
    try {
        const { data } = await anilistClient.query({
            query: GET_ANIME_BY_MAL_ID,
            variables: { ids, },
        });
        return data?.Page?.media ?? [];
    } catch (err) {
        console.error("AniList API error:", err);
        return null;
    }
};