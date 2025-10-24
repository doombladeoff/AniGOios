import { AnimeKindEnum } from "@/API/Shikimori/Shikimori.types";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { ThemedText } from "@/components/ui/ThemedText";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { useSearchStore } from "@/store/filterStore";
import * as Haptics from 'expo-haptics';
import { AnimationSpec } from "expo-symbols";
import React, { useCallback } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 40) / 2;

type KindListT = {
    key: AnimeKindEnum,
    label: string,
}

const kindList: KindListT[] = [
    { key: AnimeKindEnum.tv, label: TranslatedKind[AnimeKindEnum.tv] },
    { key: AnimeKindEnum.movie, label: TranslatedKind[AnimeKindEnum.movie] },
    { key: AnimeKindEnum.ova, label: TranslatedKind[AnimeKindEnum.ova] },
    { key: AnimeKindEnum.ona, label: TranslatedKind[AnimeKindEnum.ona] },
    { key: AnimeKindEnum.special, label: TranslatedKind[AnimeKindEnum.special] },
    { key: AnimeKindEnum.tv_special, label: TranslatedKind[AnimeKindEnum.tv_special] },
];

const checkAnimation: AnimationSpec = {
    effect: { type: "bounce", direction: "down" },
    speed: 10,
};

const KindFilter = () => {
    console.log("Render KindFilter");
    const kind = useSearchStore(state => state.kind);
    const toggleKind = useSearchStore(state => state.toggleKind);

    const handlePress = useCallback((key: AnimeKindEnum) => {
        toggleKind(key);
        Haptics.selectionAsync();
    }, [toggleKind]);

    const renderItem = ({ item, index }: { item: KindListT, index: number }) => {
        return (
            <Pressable onPress={() => handlePress(item.key)} style={styles.container}>
                <IconSymbol
                    name={kind.includes(item.key) ? "checkmark.square.fill" : "square"}
                    size={26}
                    animationSpec={checkAnimation}
                />
                <ThemedText style={styles.itemText}>{item.label}</ThemedText>
            </Pressable>
        )
    };

    return (
        <View>
            <ThemedText lightColor="black" darkColor="white" style={styles.headerText}>Тип</ThemedText>
            <FlatList
                scrollEnabled={false}
                data={kindList}
                keyExtractor={(item) => `kind-${item.key}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 8 }}
                contentContainerStyle={{ gap: 5 }}
                renderItem={renderItem}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: itemWidth,
        paddingVertical: 8,
        borderRadius: 12,

    },
    itemText: {
        marginLeft: 8,
        flexShrink: 1
    },
})

export default KindFilter;
