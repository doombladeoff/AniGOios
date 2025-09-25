import { Genre, ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { cleanDescription } from "@/utils/cleanDescription";
import { GlassView } from 'expo-glass-effect';
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Score } from "../../Score";

const AnimeItem = ({ item, index }: { item: ShikimoriAnime, index: number }) => {
    const handleNav = () => router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: item.malId } });

    return (
        <Pressable onPress={handleNav} onLongPress={null}>
            <Animated.View entering={FadeIn}>
                <GlassView isInteractive style={styles.container}>
                    <View style={{ shadowColor: 'black', shadowOpacity: 0.65, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }}>
                        <Image
                            key={`poster-${item.malId}`}
                            source={{ uri: item.poster.mainUrl }}
                            style={styles.image}
                            transition={500}
                        />
                    </View>

                    <Score
                        scoreText={item.score}
                        scoreTextStyle={styles.scoreText}
                        containerStyle={styles.scoreContainer}
                    />

                    {item.kind === 'movie' &&
                        <Text style={styles.kindText}>
                            {TranslatedKind[item.kind]}
                        </Text>
                    }

                    <View style={styles.detailsContainer}>
                        <Text
                            style={styles.title}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.russian}
                        </Text>

                        <View style={styles.genreContainer}>
                            {item?.genres.slice(0, 4).map((genre: Genre, index: number) => (
                                <View key={index} style={styles.genre}>
                                    <Text style={{ color: 'white', fontSize: 12 }} numberOfLines={1}>{genre.russian}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.description} numberOfLines={4}>{cleanDescription(item.description || 'Нет описания')}</Text>
                    </View>
                </GlassView>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        ...(Platform.Version < '26.0' && {
            backgroundColor: '#1E1E1E',
        }),
        padding: 8,
    },
    image: {
        width: 140,
        height: 200,
        backgroundColor: '#1e1e1e',
        borderRadius: 6
    },
    scoreContainer: {
        backgroundColor: '#50ca2bff',
        minWidth: 40,
        alignItems: 'center',
        position: 'absolute',
        left: 12,
        top: 12,
        padding: 4,
        borderRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 }
    },
    scoreText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12
    },
    kindText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12,
        position: 'absolute',
        left: 12,
        top: 46,
        backgroundColor: 'red',
        padding: 4,
        borderRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 }
    },
    detailsContainer: {
        flex: 1,
        flexShrink: 1,
        padding: 10,
        paddingTop: 0,
        gap: 10,
        height: 200,
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1,
        marginRight: 6,
        maxWidth: 200,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    genre: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        maxWidth: 90

    },
    description: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400'
    }
})

export default memo(AnimeItem);