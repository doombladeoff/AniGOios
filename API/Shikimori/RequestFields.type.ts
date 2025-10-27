export type AnimeFields = {
    id?: true;
    malId?: true;
    name?: true;
    russian?: true;
    licenseNameRu?: true;
    english?: true;
    japanese?: true;
    synonyms?: true;
    kind?: true;
    rating?: true;
    score?: true;
    status?: true;
    episodes?: true;
    episodesAired?: true;
    duration?: true;
    airedOn?: {
        year?: true;
        month?: true;
        day?: true;
        date?: true;
    };
    releasedOn?: {
        year?: true;
        month?: true;
        day?: true;
        date?: true;
    };
    url?: true;
    season?: true;
    poster?: {
        id?: true;
        originalUrl?: true;
        mainUrl?: true;
        main2xUrl?: true
    };
    fansubbers?: true;
    fandubbers?: true;
    licensors?: true;
    createdAt?: true;
    updatedAt?: true;
    nextEpisodeAt?: true;
    isCensored?: true;
    genres?: {
        id?: true;
        name?: true;
        russian?: true;
        kind?: true;
    };
    studios?: {
        id?: true;
        name?: true;
        imageUrl?: true;
    };
    externalLinks?: {
        id?: true;
        kind?: true;
        url?: true;
        createdAt?: true;
        updatedAt?: true;
    };
    personRoles?: {
        id?: true;
        rolesRu?: true;
        rolesEn?: true;
        person?: {
            id?: true;
            name?: true;
            poster?: {
                id?: true;
            };
        };
    };
    characterRoles?: {
        id?: true;
        rolesRu?: true;
        rolesEn?: true;
        character?: {
            id?: true;
            name?: true;
            russian?: true;
            poster?: {
                id?: true;
                mainUrl?: true;
            };
        };
    };
    related?: {
        id?: true;
        anime?: { id?: true; name?: true };
        manga?: { id?: true; name?: true };
        relationKind?: true;
        relationText?: true;
    };
    screenshots?: {
        id?: true;
        originalUrl?: true;
        x166Url?: true;
        x332Url?: true;
    };
    scoresStats?: { score?: true; count?: true };
    statusesStats?: { status?: true; count?: true };
    description?: true;
    opengraphImageUrl?: true;
    videos?: {
        id?: true;
        url?: true;
        name?: true;
        kind?: true;
        playerUrl?: true;
        imageUrl?: true;
    }
};