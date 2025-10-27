import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRouter } from "expo-router";
import { Alert, Pressable, View } from "react-native";

export const RelatedList = ({ related }: { related: any[] }) => {
    const router = useRouter();

    const relationColors: Record<string, string> = {
        sequel: "#ff9f43", // оранжевый — продолжение
        adaptation: "#34c759", // зелёный — адаптация
        side_story: "#5ac8fa", // голубой — спин-офф
        other: "#a0a0a0", // серый — прочее
        prequel: "#ff6961", // красный — приквел
    };

    return (
        <ThemedView
            style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                paddingVertical: 8,
            }}
        >
            {related.map((item, index) => {
                const title = item.anime?.name || item.manga?.name;
                const type = item.anime ? "anime" : "manga";
                const color =
                    relationColors[item.relationKind] || "rgba(255,255,255,0.3)";

                return (
                    <Pressable
                        key={item.id}
                        onPress={() => {
                            if (type === "anime" && item.anime?.id) {
                                router.push({ pathname: '/anime/[id]', params: { id: item.anime.id } })
                            } else {
                                Alert.alert('В разработке')
                            }
                        }}
                        style={({ pressed }) => ({
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            backgroundColor: pressed
                                ? "rgba(255,255,255,0.08)"
                                : "transparent",
                            borderBottomWidth:
                                index !== related.length - 1 ? 1 : 0,
                            borderBottomColor: "rgba(255,255,255,0.07)",
                        })}
                    >
                        <View style={{ flex: 1, gap: 3 }}>
                            <ThemedText
                                style={{
                                    fontSize: 15,
                                    width: '90%',
                                    fontWeight: "500",
                                }}
                                numberOfLines={1}
                            >
                                {title} {item?.anime?.id}
                            </ThemedText>
                            <ThemedText
                                style={{
                                    color: "#aaa",
                                    fontSize: 13,
                                }}
                            >
                                {type === "anime" ? "Аниме" : "Манга"}
                            </ThemedText>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <ThemedText
                                style={{
                                    color: color,
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                            >
                                {item.relationText}
                            </ThemedText>
                            <IconSymbol
                                name="chevron.right"
                                size={16}
                                color={color}
                            />
                        </View>
                    </Pressable>
                );
            })}
        </ThemedView>
    );
};