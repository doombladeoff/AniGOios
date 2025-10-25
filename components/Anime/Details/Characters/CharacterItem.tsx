import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useMappingHelper } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

export const CharacterItem = ({ item, onPress, index }: { item: any, index: number, onPress: () => void }) => {
    const { getMappingKey } = useMappingHelper();
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.8 : 1,
                    marginLeft: 5
                },
            ]}
        >
            <View style={styles.shadow}>
                {item?.character.poster ? (
                    <Image
                        key={getMappingKey(`${item.character.id}`, index)}
                        source={{ uri: item?.character.poster.mainUrl }}
                        style={styles.image}
                        transition={400}
                    />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <IconSymbol name='questionmark' color='gray' size={60} />
                    </View>
                )}
            </View>
            <ThemedText style={styles.name} numberOfLines={1}>{item.character.russian}</ThemedText>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 10,
        backgroundColor: 'gray'
    },
    placeholder: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 5,
        width: 100,
        textAlign: 'center'
    }
})
