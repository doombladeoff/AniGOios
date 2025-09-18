import { gql } from "@apollo/client";
import { client } from "../ApolloClient";

export const GET_ANIME_BY_MAL_ID = gql`
  query GetCharacter($ids: [ID!]) {
    characters(ids: $ids) {
        id
        malId
        name
        russian
        japanese
        synonyms

        createdAt
        updatedAt
        isAnime
        isManga
        isRanobe

        poster { id originalUrl mainUrl }

        description
    }
  }
`;

export const getCharacterShiki = async (id: number) => {
    try {
        const { data } = await client.query({
            query: GET_ANIME_BY_MAL_ID,
            variables: { ids: id },
        });
        return data.characters;
    } catch (err) {
        console.error("Shiki API error:", err);
        return null;
    }
};