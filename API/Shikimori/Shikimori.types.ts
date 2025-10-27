import { CrunchyrollData } from "../Crunchyroll/getCrunchyrollData";

export type ShikimoriAnime = {
    airedOn: IncompleteDate;
    characterRoles: CharacterRole[];
    chronology: ShikimoriAnime[];
    createdAt: string;
    description: string;
    descriptionHtml: string;
    descriptionSource: string;

    //  Duration in minutes 
    duration: number;
    english: string;
    episodes: string;
    episodesAired: number;
    externalLinks: ExternalLink[];
    fandubbers: string[];
    fansubbers: string[];

    //# Franchise name
    franchise: string;
    genres: Genre[];
    id: number;
    isCensored: Boolean;
    japanese: string;
    kind: AnimeKindEnum;
    licenseNameRu: string;
    licensors: string[];
    malId: number;
    name: string;
    nextEpisodeAt: string;
    opengraphImageUrl: string
    origin: AnimeOriginEnum;
    personRoles: PersonRole[];
    poster: Poster;
    rating: AnimeRatingEnum;
    related: Related[];
    releasedOn: IncompleteDate
    russian: string;
    score: number;
    scoresStats: ScoreStat[];
    screenshots: Screenshot[];
    season: string;
    status: AnimeStatusEnum
    statusesStats: StatusStat[];
    studios: Studio[];
    synonyms: string[];
    topic: Topic
    updatedAt: string;
    url: string;
    userRate: UserRate;
    videos: Video[];

    postersArray: string[];
    crunchyroll: CrunchyrollData;
    recommendations: any[];
    animatedPoster: any;
    translatedLogo: any;
    animeList: any;
    yummyEpisodes: any[];
};

export type Manga = {
    airedOn: IncompleteDate;
    chapters: number;
    characterRoles: CharacterRole[];
    chronology: Manga[];
    createdAt: string;
    description: string;
    descriptionHtml: string;
    descriptionSource: string;
    english: string;
    externalLinks: ExternalLink[];
    franchise: string;
    genres: Genre[];
    id: number;
    isCensored: Boolean;
    japanese: string;
    kind: MangaKindEnum;
    licenseNameRu: string;
    licensors: string[];
    malId: number;
    name: string;
    opengraphImageUrl: string;
    personRoles: PersonRole[];
    poster: Poster;
    publishers: Publisher[];
    related: Related[];
    releasedOn: IncompleteDate;
    russian: string;
    score: number;
    scoresStats: ScoreStat[];
    status: MangaStatusEnum;
    statusesStats: StatusStat[];
    synonyms: string[];
    topic: Topic;
    updatedAt: string;
    url: string;
    userRate: UserRate;
    volumes: number;
}

export type IncompleteDate = {
    date: string;
    day: number;
    month: number;
    year: number;
};

export type CharacterRole = {
    character: Character;
    id: number;
    rolesEn: string[];
    rolesRu: string[];
}

export type Character = {
    createdAt: string;
    description: string;
    descriptionHtml: string;
    descriptionSource: string;
    id: number;
    isAnime: Boolean;
    isManga: Boolean;
    isRanobe: Boolean;
    japanese: string;
    malId: number;
    name: string;
    poster: Poster;
    russian: string;
    synonyms: string[];
    topic: Topic;
    updatedAt: string;
    url: string;
};

export type Poster = {
    id: number;
    main2xUrl: string;
    mainAlt2xUrl: string;
    mainAltUrl: string;
    mainUrl: string;
    mini2xUrl: string;
    miniAlt2xUrl: string;
    miniAltUrl: string;
    miniUrl: string;
    originalUrl: string;
    preview2xUrl: string;
    previewAlt2xUrl: string;
    previewAltUrl: string;
    previewUrl: string;
};

export type Topic = {
    body: string;
    commentsCount: number;
    createdAt: string;
    htmlBody: string
    id: number;
    tags: string[];
    title: string;
    type: string;
    updatedAt: string;
    url: string;
};

export type ExternalLink = {
    createdAt: string;
    id: number;
    kind: ExternalLinkKindEnum;
    updatedAt: string;
    url: string;
};

export type Genre = {
    entryType: GenreEntryTypeEnum;
    id: number;
    kind: GenreKindEnum;
    name: string;
    russian: string;
}

export enum GenreEntryTypeEnum {
    Anime = "Anime",
    Manga = "Manga",
};
export enum GenreKindEnum {
    demographic = "Demographic",
    genre = "Genre",
    theme = "Theme",
};

export type PersonRole = {
    id: number;
    person: Person;
    rolesEn: string[];
    rolesRu: string[];
};

export type Person = {
    birthOn: string;
    createdAt: string;
    deceasedOn: IncompleteDate
    id: number;
    isMangaka: Boolean;
    isProducer: Boolean;
    isSeyu: Boolean;
    japanese: string
    malId: number;
    name: string;
    poster: Poster;
    russian: string;
    synonyms: string[];
    topic: Topic;
    updatedAt: string;
    url: string;
    website: string;
};

export type Related = {
    anime: ShikimoriAnime;
    id: number;
    // manga: Manga
    relationKind: RelationKindEnum;
    relationText: string;

    //# Deprecated: use relation_kind / relation_text instead.This field will be deleted after 2025-01-01
    relationEn: string;

    //# Deprecated: use relation_kind / relation_text instead.This field will be deleted after 2025-01-01
    relationRu: string;
};

export type ScoreStat = {
    count: number;
    score: number;
};

export type Screenshot = {
    id: number;
    originalUrl: string;
    x166Url: string;
    x332Url: string;
};

export type StatusStat = {
    count: number;
    status: UserRateStatusEnum;
};

export type Studio = {
    id: number;
    imageUrl: string;
    name: string;
};

export type UserRate = {
    anime: ShikimoriAnime;
    chapters: number;
    createdAt: string;
    episodes: number;
    id: number;
    manga: Manga;
    rewatches: number;
    score: number;
    status: UserRateStatusEnum;
    text: string;
    updatedAt: string;
    volumes: number;
};

export type Video = {
    id: number;
    imageUrl: string;
    kind: VideoKindEnum;
    name: string
    playerUrl: string;
    url: string;
};

export type Publisher = {
    id: number;
    name: string;
};

export enum ExternalLinkKindEnum {
    official_site = "Official Site",
    wikipedia = "Wikipedia",
    anime_news_network = "Anime News Network",
    myanimelist = "MyAnimeList",
    amediateka = "Amediateka",
    anime_db = "AniDB",
    world_art = "World Art",
    kinopoisk = "KinoPoisk",
    kage_project = "Kage Project",
    twitter = "Twitter/X",
    smotret_anime = "Anime 365",
    crunchyroll = "Crunchyroll",
    amazon = "Amazon",
    hidive = "Hidive",
    hulu = "Hulu",
    ivi = "Ivi",
    kinopoisk_hd = "KinoPoisk HD",
    wink = "Wink",
    netflix = "Netflix",
    okko = "Okko",
    youtube = "Youtube",
    readmanga = "ReadManga",
    mangalib = "MangaLib",
    remanga = "ReManga",
    mangaupdates = "Baka-Updates",
    mangadex = "MangaDex",
    mangafox = "MangaFox",
    mangachan = "Mangachan",
    mangahub = "Mangahub",
    novel_tl = "Novel.tl",
    ruranobe = "RuRanobe",
    ranobelib = "RanobeLib",
    novelupdates = "Novel Updates",
};

export enum AnimeKindEnum {
    tv = "tv",
    movie = "movie",
    ova = "ova",
    ona = "ona",
    special = "special",
    tv_special = "tv_special",
    music = "music",
    pv = "pv",
    cm = "cm",
};

export enum AnimeOriginEnum {
    original = "original",
    manga = "manga",
    web_manga = "web_manga",
    four_koma_manga = "four_koma_manga",
    novel = "novel",
    web_novel = "web_novel",
    visual_novel = "visual_novel",
    light_novel = "light_novel",
    game = "game",
    card_game = "card_game",
    music = "music",
    radio = "radio",
    book = "book",
    picture_book = "picture_book",
    mixed_media = "mixed_media",
    other = "other",
    unknown = "unknown",
};

export enum AnimeRatingEnum {
    none = "none",
    g = "g",
    pg = "pg",
    pg_13 = "pg_13",
    r = "r",
    r_plus = "r_plus",
    rx = "rx",
};

export enum RelationKindEnum {
    adaptation = "Adaptation",
    alternative_setting = "Alternative Setting",
    alternative_version = "Alternative Version",
    character = "Character",
    full_story = "Full Story",
    other = "Other",
    parent_story = "Parent Story",
    prequel = "Prequel",
    sequel = "Sequel",
    side_story = "Side Story",
    spin_off = "Spin-off",
    summary = "Summary"
};

export enum AnimeStatusEnum {
    anons = "anons",
    ongoing = "ongoing",
    released = "released",
};

export enum UserRateStatusEnum {
    planned = "Planned to Watch",
    watching = "Watching",
    rewatching = "Rewatching",
    completed = "Completed",
    on_hold = "On Hold",
    dropped = "Dropped",
};

export enum VideoKindEnum {
    pv = "pv",
    character_trailer = "Character trailer",
    cm = "CM",
    op = "OP",
    ed = "ED",
    op_ed_clip = "Music",
    clip = "Clip",
    other = "Other",
    episode_preview = "Episode preview",
};

export enum MangaKindEnum {
    manga = "Manga",
    manhwa = "Manhwa",
    manhua = "Manhua",
    light_novel = "Light Novel",
    novel = "Novel",
    one_shot = "One Shot",
    doujin = "Doujin",
};

export enum MangaStatusEnum {
    anons = "Planned",
    ongoing = "Publishing",
    released = "Published",
    paused = "Paused",
    discontinued = "Discontinued",
};