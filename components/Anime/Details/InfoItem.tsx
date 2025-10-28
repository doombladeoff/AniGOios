import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

interface LinkItem {
    id: string | number;
    name: string;
}

interface InfoItemProps {
    icon: SymbolViewProps['name'];
    label: string;
    value?: string | number | null;
    type?: 'link' | 'text';
    paramsKey?: string;
    links?: LinkItem[];
}

export const InfoItem = ({
    icon,
    label,
    value,
    type = 'text',
    paramsKey = 'id',
    links
}: InfoItemProps) => {
    const router = useRouter();

    const handlePress = (studio: LinkItem) => {
        if (type === 'link') {
            router.push({
                pathname: '/anime/animeByStudio',
                params: {
                    [paramsKey]: studio.id,
                    name: studio.name,
                },
            });
        }
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <IconSymbol name={icon} size={24} color="#bbb" />
            <ThemedText
                darkColor="#bbb"
                lightColor="rgba(49, 49, 49, 0.87)"
                style={{ fontSize: 15, width: 110 }}
            >
                {label}:
            </ThemedText>

            {links && links.length > 0 ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {links.map((studio, index) => (
                        <View key={studio.id} style={{ flexDirection: "row" }}>
                            <Pressable onPress={() => handlePress(studio)}>
                                <ThemedText
                                    darkColor="#4da3ff"
                                    lightColor="#007AFF"
                                    style={{
                                        fontSize: 15,
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    {studio.name}
                                </ThemedText>
                            </Pressable>
                            {index < links.length - 1 && (
                                <ThemedText
                                    darkColor="#bbb"
                                    lightColor="rgba(49,49,49,0.7)"
                                    style={{ fontSize: 15 }}
                                >
                                    {", "}
                                </ThemedText>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <ThemedText
                    darkColor="#bbb"
                    lightColor="rgba(49, 49, 49, 0.87)"
                    style={{ fontSize: 15, flexShrink: 1 }}
                >
                    {value || "—"}
                </ThemedText>
            )}
        </View>
    );
};
