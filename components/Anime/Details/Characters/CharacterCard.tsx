import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width / 3 - 10;
const ITEM_HEIGHT = height / 5;

const CharacterCard = ({ item }: { item: any }) => {
    const handlePress = () =>
        router.push({
            pathname: "/(screens)/characters/[id]",
            params: { id: item.character.id },
        });

    const imageSource = item?.character?.poster?.mainUrl
        ? { uri: item.character.poster.mainUrl }
        : null;

    return (
        <Animated.View
            entering={FadeIn.springify()}
            style={styles.cardWrapper}
        >
            <TouchableOpacity activeOpacity={0.8} onLongPress={() => { }}
                onPress={handlePress}
                style={[
                    styles.card,
                    {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                    }

                ]}
            >
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                        cachePolicy={'disk'}
                    />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <IconSymbol name="questionmark" color="gray" size={50} />
                    </View>
                )}

                <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    style={styles.name}
                >
                    {item?.character?.russian || item?.character?.name}
                </ThemedText>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: ITEM_WIDTH + 10,
        marginVertical: 5,
        alignItems: "center",
    },
    card: {
        width: ITEM_WIDTH,
        borderRadius: 12,
    },
    image: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
    },
    placeholder: {
        backgroundColor: 'rgba(90,90,90,0.3)',
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        fontSize: 14,
        marginTop: 6,
        textAlign: "left",
    },
});


export default memo(CharacterCard);
