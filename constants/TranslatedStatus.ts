import { AnimeKindEnum, AnimeRatingEnum, AnimeStatusEnum } from "@/API/Shikimori/Shikimori.types";

export const TranslatedStatus: Record<AnimeStatusEnum, string> = {
    released: 'Вышел',
    ongoing: 'Выходит',
    anons: 'Анонс',
};

export const TranslatedKind: Record<AnimeKindEnum, string> = {
    tv: 'Сериал',
    movie: 'Фильм',
    ova: 'OVA',
    ona: 'ONA',
    special: 'Спецвыпуск',
    tv_special: 'TV Спецвыпуск',
    music: 'Клип',
    pv: 'Проморолик',
    cm: 'Реклама'
}

export const TranslatedRating: Record<AnimeRatingEnum, string> = {
    none: 'Без рейтинга',
    g: 'Нет возрастного рейтинга',
    pg: '10+',
    pg_13: '13+',
    r: '16+',
    r_plus: '17+',
    rx: '18+'
}