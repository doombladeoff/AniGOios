import { Genre, ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { useTheme } from "@/hooks/ThemeContext";
import { cleanDescription } from "@/utils/cleanDescription";
import { GlassView } from 'expo-glass-effect';
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Platform, StyleSheet, TouchableHighlight, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Score } from "../../Score";

const AnimeItem = ({ item, index }: { item: ShikimoriAnime, index: number }) => {
    const isDarkMode = useTheme().theme === 'dark';
    const handleNav = () => router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: item.malId } });

    return (
        <TouchableHighlight underlayColor={isDarkMode ? '#141414' : 'white'} style={{ overflow: 'hidden' }} onPress={handleNav} onLongPress={() => { }}>
            <Animated.View entering={FadeIn}>
                <GlassView isInteractive style={[styles.container, {
                    ...(Platform.Version < '26.0' && {
                        backgroundColor: isDarkMode ? 'black' : 'white',
                        borderWidth: 0.35,
                        borderRadius: 20,
                        borderCurve: 'continuous',
                        borderColor: 'rgba(255,255,255,0.5)'
                    })
                }]}>
                    <View style={{
                        shadowColor: 'black',
                        shadowOpacity: 0.65,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 0 }
                    }}>
                        <Image
                            key={`poster-${item.malId}`}
                            source={{ uri: item.poster.mainUrl }}
                            style={[styles.image, {
                                ...(Platform.Version < '26.0' && {
                                    borderRadius: 12
                                }),
                            }]}
                            transition={500}
                        />
                    </View>

                    <View style={[{
                        top: 12,
                        left: 12,
                        flexDirection: 'row',
                        position: 'absolute',
                        justifyContent: 'flex-start',
                        flex: 1,
                        width: 140,
                        gap: 10
                    },]}>
                        <Score
                            scoreText={item.score.toFixed(1)}
                            scoreTextStyle={styles.scoreText}
                            containerStyle={[styles.scoreContainer, {
                                // backgroundColor: item.score <= 5 ? 'red' :
                                //     item.score < 8 ? 'orange' : '#50ca2bff',
                                backgroundColor: item.score <= 5 ? '#ff6b6b' :      // низкий рейтинг — мягкий красный
                                    item.score < 8 ? '#ffa534' :       // средний рейтинг — янтарный / золотистый
                                        '#4cd964',
                            }]}
                        />

                        {item.kind === 'movie' &&
                            <ThemedText lightColor="white" darkColor="white" style={styles.kindText}>
                                {TranslatedKind[item.kind]}
                            </ThemedText>
                        }
                    </View>

                    <View style={styles.detailsContainer}>
                        <ThemedText
                            style={styles.title}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.russian}
                        </ThemedText>

                        <View style={styles.genreContainer}>
                            {item?.genres.slice(0, 4).map((genre: Genre, index: number) => (
                                <ThemedView lightColor="rgba(72, 72, 72, 0.1)" darkColor="rgba(255,255,255,0.1)" key={index} style={styles.genre}>
                                    <ThemedText style={{ fontSize: 12 }} numberOfLines={1}>{genre.russian}</ThemedText>
                                </ThemedView>
                            ))}
                        </View>
                        <ThemedText style={styles.description} numberOfLines={4}>{cleanDescription(item.description || 'Нет описания')}</ThemedText>
                    </View>
                </GlassView>
            </Animated.View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 8,
    },
    image: {
        width: 140,
        height: 200,
        backgroundColor: '#1e1e1e',
        borderRadius: 12
    },
    scoreContainer: {
        // backgroundColor: '#50ca2bff',
        minWidth: 40,
        alignItems: 'center',
        padding: 4,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 5,
    },
    scoreText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12
    },
    kindText: {
        fontWeight: '500',
        fontSize: 12,
        backgroundColor: '#8e44ff',
        padding: 4,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 5,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        maxWidth: 90

    },
    description: {
        fontSize: 14,
        fontWeight: '400'
    }
})

export default memo(AnimeItem);