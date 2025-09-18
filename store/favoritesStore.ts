import { create } from 'zustand';

const arr = [
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 1 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 2 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: false, title: 3 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 4 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 5 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: false, title: 6 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 7 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: false, title: 8 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 9 },
    { img: 'https://images8.alphacoders.com/139/thumb-1920-1398234.png', fav: true, title: 10 },
];

interface FavoriteStore {
    favorites: typeof arr;
    filterFavorites: (type: 'Fav' | 'neFav') => void;
    resetFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
    favorites: arr,

    filterFavorites: (type) => {
        if (type === 'Fav') {
            const filtered = arr.filter(item => item.fav);
            set({ favorites: filtered });
        } else {
            const filtered = arr.filter(item => !item.fav);
            set({ favorites: filtered });
        }
    },

    resetFavorites: () => {
        set({ favorites: arr });
    }
}));
