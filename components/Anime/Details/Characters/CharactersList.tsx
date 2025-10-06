import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { CharacterItem } from "./CharacterItem";

const CharacterList = ({ id }: { id: number; }) => {
    const { charactersShiki } = useAnimeStore(useShallow(s => ({
        charactersShiki: s.animeMap[id].characterRoles
    })));

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <CharacterItem
            item={item}
            index={index}
            onPress={() => router.push({
                pathname: '/(screens)/(characters)/[id]',
                params: { id: item.character.id }
            })}
        />
    );

    return (
        <View>
            <View style={styles.containerHaeder}>
                <ThemedText style={{ fontSize: 18, fontWeight: '500' }}>Персонажи</ThemedText>
                <Link href={{
                    pathname: '/(screens)/(characters)/characters',
                    params: {
                        charactersShiki: JSON.stringify(charactersShiki)
                    }
                }} asChild>
                    <Pressable>
                        <ThemedView lightColor="black" darkColor="white" style={{ borderRadius: 12 }}>
                            <ThemedText lightColor="white" darkColor="black" style={{ fontSize: 14, paddingHorizontal: 8, paddingVertical: 4 }}>Все</ThemedText>
                        </ThemedView>
                    </Pressable>
                </Link>
            </View>
            <FlashList
                horizontal
                data={charactersShiki.slice(0, 10)}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>

    )
};

const styles = StyleSheet.create({
    containerHaeder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 15,
    }
})

export default memo(CharacterList);