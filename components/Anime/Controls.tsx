import { useTheme } from "@/hooks/ThemeContext";
import { auth, db } from "@/lib/firebase";
import {
    addFavoriteAnime,
    removeFavoriteAnime,
} from "@/lib/firebase/userFavorites";
import { useAnimeStore } from "@/store/animeStore";
import { LiquidGlassView } from "@callstack/liquid-glass";
import * as Haptics from "expo-haptics";
import {
    doc,
    onSnapshot
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../ui/ThemedText";

interface ControlsPorps {
    watchPress: () => void;
    id: string | number;
};

export const Controls = ({ watchPress, id }: ControlsPorps) => {
    const { russian, poster } = useAnimeStore((s) => s.animeMap[id as number]);
    const isDarkMode = useTheme().theme === 'dark';

    const accent = "#ff6b35";
    const glassColor = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)";
    const textColor = isDarkMode ? "#FFF" : "#1A1A1A";

    const [inFavorite, setInFavorite] = useState<boolean>(false);
    const scale = useSharedValue(1);


    useEffect(() => {
        if (!auth.currentUser) return;

        const favRef = doc(
            db,
            "user-favorites",
            auth.currentUser.uid,
            "favorites",
            id.toString()
        );

        const unsubscribe = onSnapshot(favRef, (docSnap) => {
            setInFavorite(docSnap.exists());
        });

        return () => unsubscribe();
    }, [id, auth.currentUser]);

    const handleAddFavorite = async () => {
        if (!auth.currentUser) return;

        scale.value = withTiming(inFavorite ? 1 : 1.3, { duration: 200 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (inFavorite) {
            await removeFavoriteAnime(auth.currentUser.uid, id as number);
        } else {
            await addFavoriteAnime(auth.currentUser.uid, {
                id: Number(id),
                title: russian,
                poster: poster.main2xUrl,
                status: "",
                watched: false,
            });
        }
    };

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={style.container}>
            <Pressable
                onPress={watchPress}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    flex: 1,
                })}
            >
                <LiquidGlassView
                    style={[
                        style.watchBtn,
                        {
                            borderColor: accent,
                            backgroundColor: glassColor,
                        }
                    ]}
                    effect="clear"
                >
                    <IconSymbol name="tv.fill" size={20} color={accent} />
                    <ThemedText
                        lightColor={accent}
                        darkColor={accent}
                        style={{
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Смотреть
                    </ThemedText>
                </LiquidGlassView>
            </Pressable>

            <Pressable
                onPress={handleAddFavorite}
                style={({ pressed }) => ([
                    style.favoriteBtnContainer,
                    {
                        opacity: pressed ? 0.9 : 1,
                    }
                ])}
            >
                <LiquidGlassView
                    effect="clear"
                    style={[
                        style.favoriteBtn,
                        {
                            borderColor: accent,
                            backgroundColor: glassColor,
                        }
                    ]}
                >
                    <Animated.View style={animatedIconStyle}>
                        <IconSymbol
                            name={inFavorite ? "heart.fill" : "heart"}
                            size={22}
                            color={inFavorite ? accent : textColor}
                        />
                    </Animated.View>
                </LiquidGlassView>
            </Pressable>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 10,
        paddingHorizontal: 10,
        marginTop: 12,
    },
    watchBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 10,
        gap: 8,
        height: 50,
    },
    favoriteBtnContainer: {
        width: 50,
        height: 50,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    favoriteBtn: {
        borderRadius: 16,
        borderWidth: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    }
});
