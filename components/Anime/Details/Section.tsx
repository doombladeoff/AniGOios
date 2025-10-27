import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { SymbolViewProps } from "expo-symbols";
import { View } from "react-native";

interface SectionProps {
    icon: SymbolViewProps['name'];
    title: string;
    color?: string;
    children: React.ReactNode;
}

export const Section = ({ icon, title, color = "#ffb347", children }: SectionProps) => {
    return (
        <View
            style={{
                borderRadius: 16,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 6,
                marginTop: 25,
            }}
        >
            <ThemedView
                darkColor="rgba(20, 20, 20, 1)"
                lightColor="rgba(228, 228, 228, 1)"
                style={{
                    borderRadius: 16,
                    padding: 16,
                    gap: 10,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <IconSymbol name={icon} size={22} color={color} />
                    <ThemedText
                        darkColor="#FFF"
                        style={{ fontSize: 18, fontWeight: "600" }}
                    >
                        {title}
                    </ThemedText>
                </View>
                {children}
            </ThemedView>
        </View>

    );
}
