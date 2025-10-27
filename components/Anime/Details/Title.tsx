import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

export const Title = ({ ru, eng, jap }: { ru: string; eng: string; jap: string }) => {
    return (
        <>
            <ThemedView style={{ marginTop: 10, gap: 6 }}>
                <ThemedText
                    lightColor="black"
                    style={{ fontSize: 22, fontWeight: "700" }}
                    numberOfLines={2}
                >
                    {ru || eng}
                </ThemedText>
                {eng && (
                    <ThemedText style={{ color: "#ccc", fontSize: 16 }}>
                        {eng}
                    </ThemedText>
                )}
                {jap && (
                    <ThemedText style={{ color: "#888", fontSize: 14 }}>
                        {jap}
                    </ThemedText>
                )}
            </ThemedView>
        </>
    )
}