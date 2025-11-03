import { Card } from "@/components/Anime/Card";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SettingSection from "@/components/Screens/Settings/SettingSection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedView } from "@/components/ui/ThemedView";
import { storage } from "@/utils/storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

interface IMG {
    crunch?: string;
    def?: string;
};

type SettingType = "3D" | "CrunchyPoster";

export default function PosterEditorScreen() {
    const { src } = useLocalSearchParams<{ src?: string }>();

    const [use3DPoster, setUse3DPoster] = useState(storage.get3DPoster() ?? false);
    const [useCrunchyPoster, setUseCrunchyPoster] = useState(storage.getCrunchyPoster() ?? true);
    const [showStatus, setShowStatus] = useState(storage.getShowStatus() ?? true);

    const [img, setImg] = useState<IMG | undefined>();

    useEffect(() => {
        try {
            if (src) setImg(JSON.parse(src));
        } catch {
            console.error("Ошибка постера");
        }
    }, [src]);

    const changeSettings = useCallback((type: SettingType, value: boolean) => {
        if (type === "3D") {
            setUse3DPoster(value);
            setUseCrunchyPoster(false);
            storage.set3DPoster(value);
            storage.setCrunchyPoster(false);
        } else {
            setUseCrunchyPoster(value);
            setUse3DPoster(false);
            storage.set3DPoster(false);
            storage.setCrunchyPoster(value);
        }
        Alert.alert('Внимание', 'Изменения вступят после перезапуска приложения.');
    }, []);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const speed = 600;
        const runSquare = () => {
            opacity.value = 1;
            translateX.value = withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(0, { duration: 500 }),
                    withTiming(200, { duration: speed, easing: Easing.linear }),
                    withTiming(200, { duration: speed, easing: Easing.linear }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                ),
                3,
                false,
                () => opacity.value = withTiming(0, { duration: 500 })
            );
            translateY.value = withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(0, { duration: 500 }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                    withTiming(240, { duration: speed, easing: Easing.linear }),
                    withTiming(240, { duration: speed, easing: Easing.linear }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                ), 3, false
            );
        }; runSquare();
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const Poster3D = () => (
        <View style={{ paddingTop: useHeaderHeight(), alignItems: "center", justifyContent: 'center', height: 500 }}>
            <Animated.View entering={FadeIn.delay(500).duration(800)} style={[{ position: "absolute", left: 80, top: 160, zIndex: 99999 }]}>
                <Animated.View style={animatedStyle}>
                    <IconSymbol name="hand.point.up.left.fill" size={52} color="white" style={{ shadowColor: "black", shadowOpacity: 0.8, shadowRadius: 6 }} />
                </Animated.View>
            </Animated.View>

            <Card>
                {showStatus && (
                    <Animated.View
                        entering={FadeIn}
                        style={styles.statusTagContainer}>
                        <Text style={styles.statusText}>STATUS</Text>
                    </Animated.View>
                )}
                <Image
                    priority="high"
                    transition={500}
                    source={{ uri: img?.def ?? fallbackPoster }}
                    style={styles.posterImage}
                    contentFit="cover"
                />
            </Card>
        </View>
    );

    const CrunchPoster = () => (
        <View style={styles.crunchWrapper} pointerEvents="none">
            <LinearGradient colors={["transparent", "rgba(0,0,0,1)"]} style={styles.gradient} />
            <Image
                priority="high"
                transition={500}
                contentPosition={img?.crunch ? "top center" : "center"}
                source={{ uri: img?.crunch ?? fallbackPoster }}
                style={[styles.crunchImage, { top: 0 }]}
                contentFit="cover"
            />
        </View>
    );

    return (
        <ThemedView lightColor="white" darkColor="black" style={{ flex: 1 }}>
            <ParallaxScrollView
                HEADER_HEIGHT={useCrunchyPoster ? 600 : use3DPoster ? 520 : 0}
                headerBackgroundColor={{ dark: "black", light: "black" }}
                headerImage={
                    <>
                        {use3DPoster && <Poster3D />}
                        {useCrunchyPoster && (
                            <>
                                {showStatus && (
                                    <Animated.View
                                        entering={FadeIn}
                                        style={[styles.statusTagContainer, { top: 70 }]}>
                                        <Text style={styles.statusText}>STATUS</Text>
                                    </Animated.View>
                                )}
                                <CrunchPoster />
                            </>
                        )}
                    </>
                }>
                <View style={{ paddingBottom: 60 }}>
                    <SettingSection label="Постер">
                        <SettingRow label="Использовать 3D постер" value={use3DPoster} onChange={(v) => changeSettings("3D", v)} />
                        <SettingRow label="Crunchyroll постер" value={useCrunchyPoster} onChange={(v) => changeSettings("CrunchyPoster", v)} />
                    </SettingSection>

                    <Text style={styles.noteText}>Не все аниме имеют Crunchyroll постер</Text>

                    <SettingSection label="Статус">
                        <SettingRow label="Отображать статус" value={showStatus} onChange={(v) => { setShowStatus(v); storage.setShowStatus(v); }} />
                    </SettingSection>
                </View>
            </ParallaxScrollView>
        </ThemedView>
    );
}

const SettingRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Switch value={value} onValueChange={onChange} />
    </View>
);

const fallbackPoster = "https://i.pinimg.com/736x/49/9b/6c/499b6c1c14d16216f328d6bc83258f01.jpg";

const styles = StyleSheet.create({
    posterImage: {
        width: 240,
        height: 340,
        borderRadius: 12,
    },
    statusTagContainer: {
        position: "absolute",
        top: 5,
        alignSelf: "center",
        backgroundColor: "skyblue",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 6,
        zIndex: 200,
    },
    statusText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    crunchWrapper: {
        position: "absolute",
        width: "100%",
        height: 600,
    },
    crunchImage: {
        width: "100%",
        height: 640,
        top: -100,
        position: "absolute",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        height: 640,
        zIndex: 999
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    settingLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "400",
    },
    noteText: {
        fontSize: 12,
        color: "rgba(200,200,200,0.5)",
        paddingHorizontal: 40,
        marginBottom: 20,
    },
});
