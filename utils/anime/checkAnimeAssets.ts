import { storage } from "../storage";

export async function checkAnimeAssets(malId: number) {
    const storageAssets = storage.getAnimeAssets(malId);
    if (storageAssets) {
        console.log(storageAssets)
        return storageAssets
    };

    let animatedPoster = false;
    let translatedLogo: string | undefined;

    const [checkAnimPoster, checkTranslatedLogo] = await Promise.all([
        fetch(`https://files.thousandcursedcats.com/trailers/${malId}/trailer.webm`),
        fetch(`https://files.thousandcursedcats.com/sap/${malId}/logo_1.webp`),
    ]);

    if (checkAnimPoster.status === 200) {
        animatedPoster = true;
    }
    if (checkTranslatedLogo.status === 200) {
        translatedLogo = `https://files.thousandcursedcats.com/sap/${malId}/logo_1.webp`;
    }

    storage.setAnimeAssets({ animatedPoster, translatedLogo }, malId)
    return { animatedPoster, translatedLogo };
}
