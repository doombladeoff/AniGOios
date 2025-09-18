import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMappingHelper } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

export const CharacterItem = ({ item, onPress, index }: { item: any, index: number, onPress: () => void }) => {
    const { getMappingKey } = useMappingHelper();
    return (
        <Pressable onPress={onPress}>
            {item?.character.poster ? (
                <Image
                    key={getMappingKey(`${item.character.id}`, index)}
                    source={{ uri: item?.character.poster.mainUrl }}
                    style={{ width: 100, height: 100, borderRadius: 100, marginRight: 10, backgroundColor: 'gray' }}
                    transition={400}
                />
            ) : (
                <View style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    <IconSymbol name='questionmark' color='gray' size={60} />
                </View>
            )}
            <Text style={{ color: 'white', fontSize: 14, marginTop: 5, width: 100, textAlign: 'center' }}>{item.character.russian}</Text>
        </Pressable>
    )
};
