import { gql } from "@apollo/client";
import anilistClient from "./anilistClient";

export const GET_ANIME_BY_MAL_ID = gql`
  query ($idMal: Int) {
    Media(idMal: $idMal, type: ANIME) {
      id
      coverImage {
        extraLarge
        large
      }
      bannerImage
      externalLinks {
        site
        url
      }
      streamingEpisodes{
        url
      }
      characters {
        nodes {
          age
          name {
            first
            middle
            last
            full
            native
            userPreferred
            alternative
            alternativeSpoiler
          }
          gender
          bloodType
          id
          image {
            large
            medium
          }
        }
      }
      staff {
        nodes{
          name {
            first
            middle
            last
            full
            native
          }
          image {
            large
            medium
          }
        }
      }
    }
  }
`;

export const getAnimeByMalId = async (malId: number) => {
  try {
    const { data } = await anilistClient.query({
      query: GET_ANIME_BY_MAL_ID,
      variables: { idMal: malId },
    });
    console.log('AniList', data.Media)
    return data?.Media;
  } catch (err) {
    console.error("AniList API error:", err);
    return null;
  }
};