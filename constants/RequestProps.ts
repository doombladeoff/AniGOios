import { KindShiki, OrderEnum, RequestProps } from "@/API/Shikimori/RequestInterfaces.interfaces";

export const DefaultProps: RequestProps = {
    // kind: ['tv', 'ona'],
    duration: ['D', 'F'],
    rating: ['none', 'pg_13', 'r', 'r_plus'],
    order: OrderEnum.ranked,
};

// Отдельные параметры для каждого списка
export const topProps: RequestProps = {
    kind: [KindShiki.tv, KindShiki.ova],
    status: ['ongoing', 'released'],
    limit: 10,
    ...DefaultProps,
};

export const onScreenProps: RequestProps = {
    kind: [KindShiki.tv, KindShiki.ova],
    status: ['ongoing'],
    limit: 10,
    ...DefaultProps,
};

export const filmsProps: RequestProps = {
    kind: [KindShiki.movie],
    status: ['ongoing', 'released', 'latest'],
    limit: 10,
    ...DefaultProps,
};

export const anonsProps: RequestProps = {
    status: ['anons'],
    kind: [KindShiki.tv, KindShiki.ova],
    rating: ['pg_13', 'r', 'r_plus'],
    limit: 10,
    order: OrderEnum.popularity,
};