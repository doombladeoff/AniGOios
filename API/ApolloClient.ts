import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache()

export const client = new ApolloClient({
    link: new HttpLink({ uri: "https://shikimori.one/api/graphql" }),
    cache,
});