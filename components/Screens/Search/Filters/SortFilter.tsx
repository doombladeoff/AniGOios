import { DropdownMenu } from "@/components/ContextComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSearchStore } from "@/store/filterStore";
import { View } from "react-native";

const sortLabels: Record<"ranked" | "name", string> = {
    ranked: "По рейтингу",
    name: "По названию",
};


const SortFilter = () => {
    const sort = useSearchStore(s => s.sort);
    const setSort = useSearchStore(s => s.setSort)

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>Сортировать</ThemedText>
            <DropdownMenu
                triggerItem={
                    <ThemedView lightColor='rgba(30,30,30,0.1)' darkColor='rgba(200, 200, 200, 0.1)' style={{ padding: 14, borderRadius: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <ThemedText>{sortLabels[sort]}</ThemedText>
                            <IconSymbol name='chevron.up.chevron.down' size={16} />
                        </View>
                    </ThemedView>
                }
                items={[
                    { title: sortLabels.ranked, onSelect: () => setSort("ranked") },
                    { title: sortLabels.name, onSelect: () => setSort("name") },
                ]}
            />
        </View>
    )
}

export default SortFilter;