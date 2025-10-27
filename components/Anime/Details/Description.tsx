import { ThemedText } from "@/components/ui/ThemedText";
import { cleanDescription } from "@/utils/cleanDescription";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export const Description = ({ text }: { text: string }) => {
    const description = cleanDescription(text || "");
    const shortDescription =
        description.length > 250 ? description.slice(0, 250) + "..." : description;

    const [expanded, setExpanded] = useState(false);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={{ marginTop: 10 }}>
            <ThemedText style={{ color: "#888", fontSize: 16, lineHeight: 22 }}>
                {expanded ? description : shortDescription || "Нет описания"}
            </ThemedText>

            {description.length > 250 && (
                <TouchableOpacity onPress={toggleDescription} style={{ marginTop: 4 }}>
                    <ThemedText
                        style={{
                            color: "#ff8a00",
                            fontSize: 15,
                            fontWeight: "500",
                        }}
                    >
                        {expanded ? "Свернуть ▲" : "Читать ещё ▼"}
                    </ThemedText>
                </TouchableOpacity>
            )}
        </View>
    )
}