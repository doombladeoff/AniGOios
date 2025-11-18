import { ThemedText } from "@/components/ui/ThemedText";
import { useAnimeStore } from "@/store/animeStore";
import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RecommendationItem } from "./RecommendationItem";

interface RecommendationListProps {
    id: number;
    showTitle?: boolean;
}

const RecommendationList = (props: RecommendationListProps) => {
    const recommendations = useAnimeStore(s => s.animeMap[props.id].recommendations);

    const data = useMemo(() => recommendations ?? [], [recommendations]);

    if (data.length === 0) return null;

    return (
        <View>
            {props.showTitle && <ThemedText style={styles.text}>Рекомендации</ThemedText>}
            <FlatList
                data={data.slice(0, 10)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    marginVertical: 10,
                }}
                renderItem={({ item }) => <RecommendationItem item={item} />}
                keyExtractor={(item, index) => item?.id.toString() || item.entry?.mal_id.toString() || item?.anime_id.toString() || `rec-item-${index}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        paddingHorizontal: 15,
        fontSize: 18,
        fontWeight: '600',
        zIndex: 22,
        marginTop: 10
    }
});

export default memo(RecommendationList);