import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useMappingHelper } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";

export const CharacterItem = ({ item, onPress, index }: { item: any, index: number, onPress: () => void }) => {
    const { getMappingKey } = useMappingHelper();
    return (
        <Pressable onPress={onPress}>
            {item?.character.poster ? (
                <View style={{
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 4,
                }}>
                    <Image
                        key={getMappingKey(`${item.character.id}`, index)}
                        source={{ uri: item?.character.poster.mainUrl }}
                        style={{ width: 100, height: 100, borderRadius: 100, marginRight: 10, backgroundColor: 'gray' }}
                        transition={400}
                    />
                </View>
            ) : (
                <View style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    <IconSymbol name='questionmark' color='gray' size={60} />
                </View>
            )}
            <ThemedText style={{ fontSize: 14, fontWeight: '500', marginTop: 5, width: 100, textAlign: 'center' }}>{item.character.russian}</ThemedText>
        </Pressable>
    )
};
