import { useTheme } from "@/hooks/ThemeContext"
import { useAnimeStore } from "@/store/animeStore"
import { Image, ImageStyle } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { memo, useEffect, useMemo, useState } from "react"
import { ColorValue, Dimensions, Image as RNImage, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Animated, { EntryOrExitLayoutType, FadeInDown } from "react-native-reanimated"
import { useShallow } from "zustand/shallow"
import { Status } from "../Status"

interface CrunchyPosterProps {
    id: number;
    showStatus: boolean;
    statusHeader?: string;
    showLogo?: boolean;
    statusContainer?: StyleProp<ViewStyle>;
    animationEntering?: EntryOrExitLayoutType;
    imagestyle?: StyleProp<ImageStyle>;
}

const GradeintColorsDark = ['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)'] as [ColorValue, ColorValue, ...ColorValue[]];
const GradeintColorsLight = ['transparent', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 1)'] as [ColorValue, ColorValue, ...ColorValue[]];

const CrunchyPoster = ({ showStatus, statusHeader, showLogo = true, id, statusContainer, animationEntering, imagestyle }: CrunchyPosterProps) => {
    const isDarkMode = useTheme().theme === 'dark';

    const { hasTall, hasWide, crunchyId, animeData } = useAnimeStore(useShallow(s => ({
        hasTall: s.animeMap[id]?.crunchyroll.hasTallThumbnail,
        hasWide: s.animeMap[id]?.crunchyroll.hasWideThumbnail,
        crunchyId: s.animeMap[id]?.crunchyroll.crunchyrollId,
        animeData: s.animeMap[id],
    })));

    const img_logo = animeData.crunchyroll.crunchyImages.titleLogo;

    const backgroundImage = useMemo(() => {
        if (hasTall) return animeData.crunchyroll.crunchyImages.tallThumbnail;
        if (hasWide) return animeData.crunchyroll.crunchyImages.wideThumbnail;
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
            {showStatus && <Status id={String(id)} showType="header" containerStyle={statusContainer || style.statusContainer} />}
            <LinearGradient
                colors={isDarkMode ? GradeintColorsDark : GradeintColorsLight}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', zIndex: 1 }]}
                pointerEvents='none'
            />

            <Animated.View entering={animationEntering}>
                <Image
                    source={{ uri: backgroundImage || '' }}
                    style={[imagestyle || {
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black'
                    }]}
                    contentFit="cover"
                    contentPosition={'top'}
                    transition={400}
                />
            </Animated.View>

            {(showLogo && img_logo) &&
                <Animated.View entering={FadeInDown.duration(700)} style={[style.logoImg, !isDarkMode && { shadowColor: 'black', shadowOpacity: 0.65, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }]}>
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

const style = StyleSheet.create({
    logoImg: {
        zIndex: 3,
        bottom: 0,
        alignSelf: 'center',
        position: 'absolute'
    },
    statusContainer: {
        top: 4,
        zIndex: 200,
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    }
});

export default memo(CrunchyPoster);