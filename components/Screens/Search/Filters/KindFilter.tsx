import { AnimeKindEnum } from "@/API/Shikimori/Shikimori.types";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { useSearchStore } from "@/store/filterStore";
import * as Haptics from 'expo-haptics';
import { AnimationSpec } from "expo-symbols";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 40) / 2; // 40px — примерный padding


type ItemProps = {
    item: { key: AnimeKindEnum; label: string };
};

const kindList = [
    { key: AnimeKindEnum.tv, label: TranslatedKind[AnimeKindEnum.tv] },
    { key: AnimeKindEnum.movie, label: TranslatedKind[AnimeKindEnum.movie] },
    { key: AnimeKindEnum.ova, label: TranslatedKind[AnimeKindEnum.ova] },
    { key: AnimeKindEnum.ona, label: TranslatedKind[AnimeKindEnum.ona] },
    { key: AnimeKindEnum.special, label: TranslatedKind[AnimeKindEnum.special] },
    { key: AnimeKindEnum.tv_special, label: TranslatedKind[AnimeKindEnum.tv_special] },
];

const animationButtons = {
    'check': {
        effect: {
            type: 'bounce',
            direction: 'down',
        },
        speed: 10,
    } as AnimationSpec,
}

const KindFilter = () => {
    console.log("Render KindFilter");
    const kind = useSearchStore(state => state.kind);
    const toggleKind = useSearchStore(state => state.toggleKind);

    return (
        <View>
            <Text style={{ fontSize: 18, color: "white", fontWeight: "600", marginBottom: 8 }}>Тип</Text>
            <FlatList
                scrollEnabled={false}
                data={kindList}
                keyExtractor={(item) => `kind-${item.key}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 8 }}
                contentContainerStyle={{ gap: 5 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => { toggleKind(item.key); Haptics.selectionAsync() }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: itemWidth,
                            paddingVertical: 8,
                            borderRadius: 12,
                        }}
                    >
                        <IconSymbol
                            name={kind.includes(item.key) ? "checkmark.square.fill" : "square"}
                            size={26}
                            color="white"
                            animationSpec={animationButtons['check']}
                        />
                        <Text style={{ color: "white", marginLeft: 8, flexShrink: 1 }}>{item.label}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
};

export default KindFilter;
