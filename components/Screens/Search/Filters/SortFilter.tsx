import { DropdownMenu } from "@/components/ContextComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSearchStore } from "@/store/filterStore";
import { Text, View } from "react-native";

const sortLabels: Record<"ranked" | "name", string> = {
    ranked: "По рейтингу",
    name: "По названию",
};


const SortFilter = () => {
    const sort = useSearchStore(s => s.sort);
    const setSort = useSearchStore(s => s.setSort)

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: '500' }}>Сортировать</Text>
            <DropdownMenu
                triggerItem={
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ color: "white" }}>{sortLabels[sort]}</Text>
                        <IconSymbol name='chevron.up.chevron.down' size={16} color='white' />
                    </View>
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