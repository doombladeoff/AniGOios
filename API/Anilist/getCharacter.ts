import { gql } from "@apollo/client";
import anilistClient from "./anilistClient";

export const GET_ANIME_BY_MAL_ID = gql`
  query ($id: Int) {
   Character(id: $id) {
    id
    age
    name {
      first
      middle
      last
      full
      native
      userPreferred
      alternativeSpoiler
    }
    gender
    image {
      large
      medium
    }
    dateOfBirth {
      year
      month
      day
    }
    bloodType
  }
  }
`;

export const getCharacter = async (id: number) => {
    try {
        const { data } = await anilistClient.query({
            query: GET_ANIME_BY_MAL_ID,
            variables: { id, },
        });
        return data?.Character;
    } catch (err) {
        console.error("AniList API error:", err);
        return null;
    }
};