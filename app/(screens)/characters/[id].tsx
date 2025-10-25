import { getCharacterJikan } from "@/API/Jikan/getCharacterJikan";
import { getCharacterShiki } from "@/API/Shikimori/getCharacterShiki";
import { VoiceOversStack } from "@/components/Anime/Details/Characters";
import { GradientBlur } from "@/components/GradientBlur";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { useScrollOpacity } from "@/hooks/useScrollOpacity";
import { cleanDescription } from "@/utils/cleanDescription";

import {
    BottomSheet,
    Button,
    Host,
    HStack,
    Spacer,
    Image as UIImage,
    Text as UIText,
    VStack,
} from "@expo/ui/swift-ui";
import { background, cornerRadius, padding } from "@expo/ui/swift-ui/modifiers";

import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CharacterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const isDarkMode = useTheme().theme === "dark";

    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const { animatedStyle, scrollHandler } = useScrollOpacity(200);

    const [loading, setLoading] = useState(true);
    const [bottomOpened, setBottomOpened] = useState(false);
    const [character, setCharacter] = useState<{ d1: any; d2: any }>({
        d1: null,
        d2: null,
    });
    const { d1, d2 } = character;

    const gradientColors = useMemo(
        () => easeGradient({
            colorStops: {
                0: { color: "black" },
                0.5: {
                    color: isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
                },
                1: { color: "transparent" },
            },
        }),
        [isDarkMode]
    );

    const fetchCharacter = useCallback(async () => {
        try {
            setLoading(true);
            const [shikiData, jikanData] = await Promise.all([
                getCharacterShiki(Number(id)),
                getCharacterJikan(id as string),
            ]);
            setCharacter({ d1: shikiData[0], d2: jikanData });
        } catch (error) {
            console.error("Error loading character:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!character.d1) fetchCharacter();
    }, [id]);

    const BackgroundBlur = () => {
        if (Platform.Version < '26.0') {
            return (
                <BlurView
                    tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                    intensity={100}
                    style={[StyleSheet.absoluteFillObject, {
                        flex: 1,
                        zIndex: 0,
                        top: headerHeight,
                    }]}
                    pointerEvents='none'
                />
            );
        }
        return null
    };

    if (loading) {
        return (
            <ThemedView lightColor="white" darkColor="black" style={styles.loaderContainer}>
                <BackgroundBlur />
                <ActivityIndicator size="large" color="white" />
            </ThemedView>
        );
    };

    return (
        <ThemedView
            lightColor="white"
            darkColor="black"
            style={styles.container}
        >
            <Fragment>
                <GradientBlur
                    colors={gradientColors.colors}
                    locations={gradientColors.locations}
                    containerStyle={[
                        styles.gradientContainer,
                        { width, height: insets.top * 2.5 },
                    ]}
                    tint="light"
                    blurIntensity={20}
                />

                <Animated.View
                    style={[
                        styles.headerGradient,
                        { height: headerHeight / 4 },
                        animatedStyle,
                    ]}
                >
                    <LinearGradient
                        colors={
                            isDarkMode
                                ? ["black", "rgba(0,0,0,0.5)", "transparent"]
                                : ["white", "rgba(255,255,255,0.5)", "transparent"]
                        }
                        style={[StyleSheet.absoluteFill, { height: headerHeight }]}
                        pointerEvents="none"
                    />
                </Animated.View>
            </Fragment>

            <View style={styles.backgroundWrapper}>
                <Image
                    source={{ uri: d1.poster.mainUrl }}
                    style={styles.backgroundImage}
                    blurRadius={30}
                    transition={500}
                />
                <LinearGradient
                    colors={
                        isDarkMode
                            ? ["transparent", "rgba(0,0,0,0.6)", "black"]
                            : ["transparent", "rgba(255,255,255,0.25)", "white"]
                    }
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
                />
            </View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: headerHeight + 20, paddingBottom: insets.bottom },
                ]}
                entering={FadeIn.duration(500)}
            >
                <Image source={{ uri: d1.poster.mainUrl }} style={styles.poster} />

                <View style={styles.contentWrapper}>
                    <Pressable
                        onPress={() => setBottomOpened(true)}
                        style={styles.nameButton}
                    >
                        <ThemedText style={styles.characterName}>{d1.russian}</ThemedText>
                        <IconSymbol name="questionmark.circle.fill" size={18} color={isDarkMode ? 'white' : 'black'} />
                    </Pressable>

                    <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
                    <View style={styles.descriptionBox}>
                        <ThemedText style={styles.descriptionText}>
                            {cleanDescription(d1.description || "Нет описания")}
                        </ThemedText>
                    </View>

                    <View style={styles.voiceSection}>
                        <VoiceOversStack items={d2.voices} />
                    </View>
                </View>
            </Animated.ScrollView>

            <Host style={{ position: "absolute", width }}>
                <BottomSheet
                    isOpened={bottomOpened}
                    onIsOpenedChange={() => setBottomOpened(false)}
                >
                    <VStack spacing={15} modifiers={[padding({ all: 20 })]}>
                        <HStack>
                            <UIText size={18} weight="bold">
                                Имена
                            </UIText>
                            <Spacer />
                            <Button
                                modifiers={[
                                    background("rgba(80,80,80, 0.5)"),
                                    cornerRadius(100),
                                ]}
                                onPress={() => setBottomOpened(false)}
                            >
                                <UIImage
                                    systemName="xmark"
                                    size={16}
                                    modifiers={[padding({ all: 10 })]}
                                />
                            </Button>
                        </HStack>
                        {[
                            { lang: "English:", name: d1.name },
                            { lang: "Japanese:", name: d1.japanese },
                            { lang: "Русский:", name: d1.russian },
                        ].map((item) => (
                            <HStack key={`lang-${item.lang}`} spacing={10}>
                                <UIText>{item.lang}</UIText>
                                <UIText>{item.name}</UIText>
                                <Spacer />
                            </HStack>
                        ))}
                    </VStack>
                </BottomSheet>
            </Host>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        zIndex: 1,
    },
    headerGradient: {
        position: "absolute",
        width: "100%",
        zIndex: 1,
    },
    backgroundWrapper: {
        position: "absolute",
        width: "100%",
        height: 500,
        zIndex: 0,
        top: 0,
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
    },
    scrollContent: { paddingHorizontal: 10 },
    poster: {
        width: 180,
        height: 240,
        borderRadius: 8,
        shadowColor: "black",
        shadowRadius: 4,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
        alignSelf: "center",
        zIndex: 3,
    },
    contentWrapper: {
        padding: 10,
        paddingTop: 0
    },
    nameButton: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        alignSelf: "center",
    },
    characterName: {
        fontSize: 18,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        paddingLeft: 5,
        paddingBottom: 5,
    },
    descriptionBox: {
        backgroundColor: "rgba(108, 108, 108, 0.45)",
        borderRadius: 12,
        padding: 10,
        gap: 5,
    },
    descriptionText: { fontSize: 16 },
    voiceSection: { marginTop: 20 },
});
