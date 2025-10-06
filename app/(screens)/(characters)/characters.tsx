import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

const { width } = Dimensions.get("screen");
const ITEM_WIDTH = width / 3 - 10;
const ITEM_HEIGHT = 190;

export default function CharactersScreen() {
    const headerHeight = useHeaderHeight();
    const { charactersShiki: b } = useLocalSearchParams<{ charactersShiki: string }>();
    const charactersShiki = JSON.parse(b || "[]");

    const renderItem = ({ item }: { item: any }) => (
        <CharacterCard item={item} />
    );

    return (
        <ThemedView darkColor="black" style={styles.container}>
            <Animated.FlatList
                entering={FadeIn}
                exiting={FadeOut}
                data={charactersShiki}
                numColumns={3}
                renderItem={renderItem}
                keyExtractor={(item) => item.character.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: headerHeight + 10,
                    paddingBottom: headerHeight / 1.5,
                    paddingHorizontal: 6,
                }}
            />
        </ThemedView>
    );
}

const CharacterCard = memo(({ item }: { item: any }) => {
    const handlePress = () =>
        router.push({
            pathname: "/(screens)/(characters)/[id]",
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
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.card,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }
                ]}
            >
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <IconSymbol name="questionmark" color="gray" size={50} />
                    </View>
                )}

                <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    style={styles.name}
                >
                    {item.character.russian}
                </ThemedText>
            </Pressable>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        fontSize: 14,
        marginTop: 6,
        textAlign: "left",
    },
});
