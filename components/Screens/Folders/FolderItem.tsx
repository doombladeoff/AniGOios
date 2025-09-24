import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types"
import { Score } from "@/components/RenderList/Score"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { TranslatedKind, TranslatedStatus } from "@/constants/TranslatedStatus"
import { GlassView } from "expo-glass-effect"
import { Image } from "expo-image"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInRight, FadeOut, FadeOutLeft, LinearTransition } from "react-native-reanimated"

interface FolderItemProps {
    editMode: boolean;
    include: boolean;
    onPress: () => void;
    item: ShikimoriAnime;
    index: number;
}

export const FolderItem = ({ editMode, include, onPress, item, index }: FolderItemProps) => {
    return (
        <Animated.View
            layout={LinearTransition.springify()}
            entering={FadeInRight.delay(200 * (index + 1)).duration(350)}
            exiting={FadeOutLeft}
        >
            <GlassView tintColor='regular' isInteractive style={styles.container}>
                <Pressable style={{ flex: 1, flexDirection: 'row' }} onPress={onPress}>
                    {editMode && (
                        <Animated.View
                            entering={FadeInRight}
                            exiting={FadeOut}
                            style={{ justifyContent: 'center', marginRight: 10 }}
                        >
                            <IconSymbol
                                name={include ? 'checkmark.circle.fill' : 'circle'}
                                size={24}
                                color={'white'}
                            />
                        </Animated.View>
                    )}

                    <Score
                        scoreText={item.score}
                        scoreTextStyle={styles.score}
                    />
                    <View style={{ shadowColor: 'black', shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }}>
                        <Image
                            source={{ uri: item.poster.main2xUrl }}
                            style={{ width: 140, height: 190, borderRadius: 10 }}
                            transition={600}
                        />
                    </View>
                    <View style={styles.datailsContainer}>
                        <Text style={styles.title} numberOfLines={2}>{item.russian}</Text>
                        <View style={styles.genreContainer}>
                            {item.genres.map((genre, index) => (
                                <Text key={`genre-${genre.id}`} style={styles.genre}>
                                    {genre.russian}{index < item.genres.length - 1 && (', ')}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.statKindContainer}>
                            {[TranslatedStatus[item.status], TranslatedKind[item.kind]].map((item, index) => (
                                <Text key={`${index}-item`} style={styles.statKindText}>
                                    {item}
                                </Text>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </GlassView>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(76, 76, 76, 0.5)',
        padding: 8,
        borderRadius: 18,
        marginBottom: 10
    },
    score: {
        color: "white",
        fontWeight: '600',
        position: 'absolute',
        left: 5,
        top: 5,
        zIndex: 1,
        backgroundColor: "#50ca2bff",
        borderRadius: 8,
        padding: 2,
        paddingHorizontal: 8,
        shadowColor: 'black', shadowOpacity: 0.65,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 }
    },
    datailsContainer: {
        flex: 1,
        flexShrink: 1,
        gap: 10,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    genreContainer: {
        flexDirection: "row",
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    genre: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white'
    },
    statKindContainer: {
        flexDirection: "row",
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 10,
        shadowColor: 'black',
        shadowOpacity: 0.65,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 }
    },
    statKindText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
        padding: 4,
        paddingHorizontal: 8,
        backgroundColor: '#423f3fff',
        borderRadius: 8
    }
})