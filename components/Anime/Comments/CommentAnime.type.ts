export type CommentAnimeT = {
    id: string;
    createdAt: string;
    // rating: number;
    text: string;
    // titleText: string;
    user: {
        id: string;
        name: string;
        photoURL: string;
    }
}
