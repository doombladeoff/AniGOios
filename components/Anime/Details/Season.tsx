import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolViewProps } from "expo-symbols";
import { ColorValue, View } from "react-native";

export const Season = ({ season }: { season?: string }) => {
    if (!season) return null;

    const [seasonName, year] = season.split("_");
    const formattedYear = year || "—";

    const seasonMap: Record<string, {
        label: string;
        color: string;
        icon: SymbolViewProps['name'];
        gradient: [ColorValue, ColorValue, ...ColorValue[]]
    }
    > = {
        winter: {
            label: "Зима",
            color: "#00BFFF",
            icon: "snow",
            gradient: ["#002233", "#004466"] as const,
        },
        spring: {
            label: "Весна",
            color: "#7FFF00",
            icon: "leaf.fill",
            gradient: ["#123", "#145214"] as const,
        },
        summer: {
            label: "Лето",
            color: "#FFD700",
            icon: "sun.max.fill",
            gradient: ["#663300", "#ffae00"] as const,
        },
        fall: {
            label: "Осень",
            color: "#FF8C00",
            icon: "leaf.fill",
            gradient: ["#331100", "#995500"] as const,
        },
    };

    const current = seasonMap[seasonName] || {
        label: "Неизвестно",
        color: "#888",
        icon: "calendar",
        gradient: ["#111", "#222"] as const
    };

    return (
        <ThemedView style={{ marginTop: 25 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10 }}>
                <IconSymbol name="calendar" size={22} color="#ff9f0a" />
                <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
                    Сезон выхода
                </ThemedText>
            </View>

            <GlassView isInteractive glassEffectStyle="regular" style={{
                borderRadius: 16, marginTop: 12,
                shadowColor: "#000",
                shadowOpacity: 0.4,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 6,
            }}>
                <LinearGradient
                    colors={current.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{

                        borderRadius: 16,
                        padding: 16,
                        gap: 10,
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <IconSymbol name={current.icon} size={26} color={current.color} />
                        <ThemedText
                            style={{
                                color: current.color,
                                fontSize: 20,
                                fontWeight: "700",
                            }}
                        >
                            {current.label} {formattedYear}
                        </ThemedText>
                    </View>
                </LinearGradient>
            </GlassView>
        </ThemedView >
    );
};
