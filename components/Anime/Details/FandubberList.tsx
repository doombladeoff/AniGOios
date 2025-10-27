import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useState } from "react";
import { Pressable, View } from "react-native";

export const FandubberList = ({ fandubbers, maxVisible = 5 }: { fandubbers: string[], maxVisible?: number }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
    };

    const visibleList = expanded ? fandubbers : fandubbers.slice(0, maxVisible);

    return (
        <ThemedView
            style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 12,
                gap: 6,
            }}
        >
            {visibleList.map((studio, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingVertical: 4,
                    }}
                >
                    <IconSymbol name="waveform" size={18} color="#ffb347" />
                    <ThemedText style={{ color: "#888", fontSize: 15 }}>{studio}</ThemedText>
                </View>
            ))}

            {fandubbers.length > maxVisible && (
                <Pressable
                    onPress={toggleExpanded}
                    style={{
                        marginTop: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        paddingVertical: 4,
                    }}
                >
                    <IconSymbol
                        name={expanded ? "chevron.up" : "chevron.down"}
                        size={16}
                        color="#888"
                    />
                    <ThemedText style={{ color: "#888", fontSize: 14 }}>
                        {expanded ? "Свернуть" : "Показать все"}
                    </ThemedText>
                </Pressable>
            )}
        </ThemedView>
    );
};
