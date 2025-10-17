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

/**
 * Интерфейс параметров запроса к Shikimori API для поиска и фильтрации аниме.
 *
 * Используется для динамической генерации строки запроса (`query string`).
 * Все поля являются необязательными — можно передавать только нужные фильтры.
 *
 * @example
 * ```ts
 * const params: RequestProps = {
 *   name: "Naruto",
 *   kind: ["tv"],
 *   status: ["released"],
 *   order: "popularity",
 *   limit: 20,
 * };
 * ```
 */
export interface RequestProps {
  /**
   * 🔍 Поисковый запрос по названию аниме.
   *
   * Совпадение ищется по `russian` и `english` полям названия.
   *
   * @example "Attack on Titan"
   */
  name?: string;

  /**
   * Список ID аниме для выборочного получения.
   *
   * Можно указать одно или несколько значений через запятую.
   *
   * @example "21, 322, 543"
   */
  ids?: string;

  /**
   * 🎬 Тип произведения (kind).
   *
   * Используется для фильтрации по формату:
   * - `"tv"` — сериал
   * - `"movie"` — фильм
   * - `"ova"` — OVA
   * - `"ona"` — ONA
   * - `"special"` — спецвыпуск
   *
   * @example ["tv", "movie"]
   */
  kind?: KindShiki[];

  /**
   * Статус выхода.
   *
   * - `"ongoing"` — выходит сейчас  
   * - `"released"` — уже завершено  
   * - `"latest"` — недавно добавленные  
   * - `"anons"` — анонсированные
   *
   * @example ["ongoing", "released"]
   */
  status?: ("ongoing" | "released" | "latest" | "anons")[];

  /**
   * Количество элементов в ответе.
   *
   * - Минимум: `1`
   * - Максимум: `50`
   * - Значение по умолчанию: `2`
   *
   * Если указано больше 50 — автоматически ограничивается.
   *
   * @example 20
   */
  limit?: number;

  /**
   * Поле сортировки (order).
   *
   * Определяет порядок результатов: по рейтингу, популярности, дате выхода и т.д.
   *
   * Использует перечисление {@link OrderEnum}.
   *
   * @example "ranked"
   */
  order?: OrderEnum;

  /**
   * Длительность эпизодов (duration).
   *
   * Используется для фильтрации по длине серий:
   * - `"S"` — короткие, < 10 мин.
   * - `"D"` — средние, < 30 мин.
   * - `"F"` — длинные, > 30 мин.
   *
   * @example ["F"]
   */
  duration?: DurationShikiType[];

  /**
   * Рейтинг контента (rating).
   *
   * Позволяет фильтровать по возрастному ограничению:
   * - `"none"` — без рейтинга  
   * - `"g"` — G, для всех  
   * - `"pg"` — PG, для детей  
   * - `"pg_13"` — PG-13, от 13 лет  
   * - `"r"` — R, 17+ (насилие, ругань)  
   * - `"r_plus"` — R+, лёгкая нагота  
   * - `"rx"` — Rx, хентай / экстремальный контент  
   *
   * @example ["pg_13", "r"]
   */
  rating?: RatingShikiType[];

  /**
   * Номер страницы.
   *
   * Нумерация начинается с 1.
   *
   * @example 3
   */
  page?: number;

  /**
   * Сезон или год выхода.
   *
   * Может быть указан год или диапазон, а также конкретный сезон:
   * - `"2016"`  
   * - `"2014_2016"`  
   * - `"summer_2017"`
   *
   * @example "spring_2021"
   */
  season?: string;

  /**
   * Жанры аниме.
   *
   * Список строковых идентификаторов жанров.
   *
   * @example ["action", "drama", "fantasy"]
   */
  genre?: string[];

  /**
   * Минимальная оценка.
   *
   * Используется для фильтрации по пользовательскому рейтингу Shikimori.
   *
   * Целое число от 0 до 10.
   *
   * @example 8
   */
  score?: number;
}