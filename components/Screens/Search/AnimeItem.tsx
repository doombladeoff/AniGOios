import { Genre, ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { cleanDescription } from "@/utils/cleanDescription";
import { GlassView } from 'expo-glass-effect';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Score } from "../../RenderList/Score";

const AnimeItem = memo(({ item, index }: { item: ShikimoriAnime, index: number }) => {
    const handleNav = () => router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: item.malId } });

    return (
        <Pressable onPress={handleNav} onLongPress={null} style={styles.container}>
            <Image
                key={`poster-${item.malId}`}
                source={{ uri: item.poster.mainUrl }}
                style={styles.image}
                transition={500}
            />

            <LinearGradient
                colors={[
                    'rgba(30,30,30,0)',
                    'rgba(30,30,30,1)'
                ]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />

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

            {/* EXPEREMENTAL ON IOS 26 */}
            <GlassView glassEffectStyle='regular' style={styles.detailsContainer}>
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
            </GlassView>
        </Pressable>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        overflow: 'hidden',
    },
    image: {
        width: 140,
        height: 200,
        backgroundColor: '#1e1e1e'
    },
    gradient: {
        zIndex: 2,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 90,
        width: 50
    },
    scoreContainer: {
        backgroundColor: '#50ca2bff',
        minWidth: 40,
        alignItems: 'center',
        position: 'absolute',
        left: 4,
        top: 4,
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
        left: 4,
        top: 34,
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

export default AnimeItem;