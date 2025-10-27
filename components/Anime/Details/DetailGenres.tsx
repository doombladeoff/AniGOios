import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

export const DetailsGenre = ({ genres }: { genres: { id: number; russian: string; name: string }[] }) => {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 6,
            }}
        >
            {genres.map((genre) => (
                <Pressable key={genre.id} onPress={() => router.push({ pathname: '/anime/animeByGenre', params: { genre_id: genre.id, genre_name: genre.russian } })}>
                    <GlassView
                        glassEffectStyle='regular'
                        isInteractive
                        style={{ borderRadius: 20, overflow: "hidden" }}
                    >
                        <LinearGradient
                            colors={
                                isDarkMode
                                    ? ["#ff6b6b", "#feca57"]
                                    : ["#ff9f43", "#ff6b6b"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 6,
                                borderRadius: 20,
                                shadowColor: "#000",
                                shadowOpacity: 0.25,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 3,
                            }}
                        >
                            <ThemedText
                                style={{
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                            >
                                {genre.russian || genre.name}
                            </ThemedText>
                        </LinearGradient>
                    </GlassView>
                </Pressable>
            ))}
        </View>
    );
};