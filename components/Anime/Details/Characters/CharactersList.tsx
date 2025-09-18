import { useAnimeStore } from "@/store/animeStore";
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
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
            {console.log('Render Characters')}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 9999, marginHorizontal: 10, marginBottom: 15, }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'white', }}> Персонажи</Text>
                <Link href={{
                    pathname: '/(screens)/(characters)/characters',
                    params: {
                        charactersShiki: JSON.stringify(charactersShiki)
                    }
                }} asChild>
                    <Pressable>
                        <Text style={{ fontSize: 14, backgroundColor: 'white', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>Все</Text>
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
}

export default CharacterList;