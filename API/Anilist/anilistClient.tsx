import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache()

const anilistClient = new ApolloClient({
    link: new HttpLink({ uri: "https://graphql.anilist.co" }),
    cache,
});


export default anilistClient;