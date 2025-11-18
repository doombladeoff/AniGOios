import { ThemedText } from "@/components/ui/ThemedText";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export const RecommendationItem = ({ item }: { item: any }) => {

    const handleNavigate = () => {
        const id = item?.id || item?.entry?.mal_id || item?.remote_ids?.shikimori_id;
        router.push({
            pathname: "/(screens)/anime/[id]",
            params: { id },
        });
    };

    const imageUrl =
        `https://shikimori.one${item?.image?.original}` ||
        item?.entry?.images?.webp?.large_image_url ||
        `https:${item?.poster?.fullsize}`;

    const title = item?.russian || item?.entry?.title || item?.title;

    return (
        <Pressable
            onPress={handleNavigate}
            style={{ marginHorizontal: 5 }}
        >
            <View style={styles.shadow}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                />
            </View>
            <ThemedText style={styles.title} numberOfLines={2}>
                {title}
            </ThemedText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    image: {
        width: 160,
        height: 220,
        borderRadius: 20,
        marginBottom: 5,
        backgroundColor: '#1e1e1e'
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        maxWidth: 120,
        paddingLeft: 5
    }
})