import { useAnimeStore } from "@/store/animeStore"
import { getLinks } from "@/utils/crunchyroll/getCrunchyrollData"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { memo, useEffect, useMemo, useState } from "react"
import { Dimensions, Image as RNImage, StyleSheet, View } from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useShallow } from "zustand/shallow"
import { Status } from "../Status"

interface CrunchyPosterProps {
    id: number;
    showStatus: boolean;
    statusHeader?: string;
    // img: string;
    showLogo?: boolean;
    // img_logo: string;
}

const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get('screen');

const CrunchyPoster = ({ showStatus, statusHeader, showLogo = true, id }: CrunchyPosterProps) => {
    const { hasTall, hasWide, crunchyId, logo } = useAnimeStore(useShallow(s => ({
        hasTall: s.animeMap[id]?.crunchyroll.crunchyPosters.hasTall,
        hasWide: s.animeMap[id]?.crunchyroll.crunchyPosters.hasWide,
        crunchyId: s.animeMap[id]?.crunchyroll.crunchyData.crunchyrollId,
        logo: s.animeMap[id]?.translatedLogo
    })));

    const img_logo = logo || (crunchyId && getLinks(crunchyId).titleThumbnail);

    const backgroundImage = useMemo(() => {
        if (hasTall) return getLinks(crunchyId, ScreenWidth * 3, ScreenHeight * 3, "tall").backgroundThumbnail;
        if (hasWide) return getLinks(crunchyId, ScreenWidth * 5, ScreenHeight * 3, "wide").backgroundThumbnail;
    }, [crunchyId, hasTall, hasWide]);

    const [size, setSize] = useState({ width: 600, height: 150 });

    useEffect(() => {
        if (!img_logo) return;
        RNImage.getSize(
            img_logo,
            (width, height) => {
                let newWidth = width;
                if (width >= 600) {
                    newWidth = Dimensions.get('screen').width / 1.5;
                }
                setSize({ width: newWidth, height: 120 });
            },
            (error) => { console.error("Ошибка получения размера:", error); }
        );
    }, [img_logo]);

    return (
        <View>
            {console.log('CrunchyPoster Render', showStatus, id)}
            {showStatus && <Status id={String(id)} showType="header" />}
            <LinearGradient colors={['transparent', 'transparent', 'rgba(0,0,0,0.5)', 'black']}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', zIndex: 1 }]}
                pointerEvents='none' />
            <Animated.View entering={FadeInUp.duration(700)}>
                <Image
                    source={{ uri: backgroundImage }}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    contentFit="cover"
                    contentPosition={'top'}
                    transition={400}
                />
            </Animated.View>

            {showLogo &&
                <Animated.View entering={FadeInDown.duration(700)} style={{ zIndex: 3, bottom: 0, alignSelf: 'center', position: 'absolute' }}>
                    <Image source={{ uri: img_logo }}
                        style={{
                            width: size.width,
                            height: size.height,
                            backgroundColor: 'transparent', margin: 10
                        }}
                        transition={400}
                        contentFit='contain' />
                </Animated.View>
            }

        </View>
    )
};

export default memo(CrunchyPoster);