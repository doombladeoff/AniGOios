export type KindShikiType =
  | "tv"
  | "movie"
  | "ova"
  | "ona"
  | "special"
  | "tv_special"
  | "music";

export enum KindShiki {
  movie = "movie",
  music = "music",
  ona = "ona",
  ova = "ova",
  special = "special",
  tv = "tv",
  tv_13 = "tv_13",
  tv_24 = "tv_24",
  tv_48 = "tv_48",
  tv_special = "tv_special",
  pv = "pv",
  cm = "cm",
}

export type DurationShikiType = "S" | "D" | "F";

export type RatingShikiType = "none" | "g" | "pg" | "pg_13" | "r" | "r_plus";

export enum OrderEnum {
  id = "id",
  id_desc = "id_desc",
  ranked = "ranked",
  kind = "kind",
  popularity = "popularity",
  name = "name",
  aired_on = "aired_on",
  episodes = "episodes",
  status = "status",
  random = "random",
  ranked_random = "ranked_random",
  ranked_shiki = "ranked_shiki",
  created_at = "created_at",
  created_at_desc = "created_at_desc",
}

export interface RequestProps {
  name?: string;
  ids?: string;
  kind?: KindShiki[];
  status?: ("ongoing" | "released" | "latest" | "anons")[];
  /**
   * Максимальное значение для limit — 50.
   * default — 2
   * Если указано больше 50, оно будет автоматически ограничено.
   */
  limit?: number;
  order?: OrderEnum;
  /**
   * S - Less than 10 minutes
   * D - Less than 30 minutes
   * F - More than 30 minutes
   */
  duration?: DurationShikiType[];
  /*
  Query RatingString:
    none - No rating
    g - G - All ages
    pg - PG - Children
    pg_13 - PG-13 - Teens 13 or older
    r - R - 17+ recommended (violence & profanity)
    r_plus - R+ - Mild Nudity (may also contain violence & profanity)
    rx - Rx - Hentai (extreme sexual content/nudity)
  */
  rating?: RatingShikiType[];
  page?: number;
  /* year (examples 2016, 2014_2016, summer_2017) */
  season?: string;
  genre?: string[];
}