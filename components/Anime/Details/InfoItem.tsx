import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { SymbolViewProps } from "expo-symbols";
import { View } from "react-native";

interface InfoItemProps {
    icon: SymbolViewProps['name'];
    label: string;
    value?: string | number | null;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <IconSymbol name={icon} size={24} color="#bbb" />
            <ThemedText darkColor="#bbb" lightColor="rgba(49, 49, 49, 0.87)" style={{ fontSize: 15, width: 110 }}>
                {label}:
            </ThemedText>
            <ThemedText darkColor="#bbb" lightColor="rgba(49, 49, 49, 0.87)" style={{ fontSize: 15, flexShrink: 1 }}>
                {value || "—"}
            </ThemedText>
        </View>
    );
}