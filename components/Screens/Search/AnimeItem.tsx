import { Genre, ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { TranslatedKind } from "@/constants/TranslatedStatus";
import { cleanDescription } from "@/utils/cleanDescription";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Score } from "../../RenderList/Score";

const AnimeItem = memo(({ item, index }: { item: ShikimoriAnime, index: number }) => {
    return (
        <Pressable
            onPress={() => {
                router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: item.malId } })

            }}
            style={{
                flexDirection: 'row',
                borderRadius: 12,
                backgroundColor: '#1E1E1E',
                overflow: 'hidden',
            }}
        >
            <Image
                key={`poster-${item.malId}`}
                source={{ uri: item.poster.mainUrl }}
                style={{ width: 140, height: 200, backgroundColor: 'gray' }}
                transition={500}
            />

            <LinearGradient
                colors={[
                    'rgba(30,30,30,0)',
                    'rgba(30,30,30,1)'
                ]}
                style={{
                    zIndex: 2,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 90,
                    width: 50
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />

            <Score
                scoreText={item.score}
                scoreTextStyle={{ color: 'white', fontWeight: '500', fontSize: 14 }}
                containerStyle={{ backgroundColor: 'green', minWidth: 40, alignItems: 'center', position: 'absolute', left: 4, top: 4, padding: 4, borderRadius: 8 }}
            />

            {item.kind === 'movie' &&
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 14,
                        position: 'absolute',
                        left: 4,
                        top: 34,
                        backgroundColor: 'red',
                        padding: 4,
                        borderRadius: 8
                    }}
                >
                    {TranslatedKind[item.kind]}
                </Text>
            }


            <View style={{ flex: 1, flexShrink: 1, padding: 10, gap: 10, height: 200 }}>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                        flexShrink: 1,
                        marginRight: 6,
                        maxWidth: 200,
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item.russian}
                </Text>

                {/* Жанры */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {item?.genres.slice(0, 4).map((genre: Genre, index: number) => (
                        <View
                            key={index}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 8,
                                maxWidth: 90
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 12 }} numberOfLines={1}>{genre.russian}</Text>
                        </View>
                    ))}
                </View>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '400' }} numberOfLines={4}>{cleanDescription(item.description || 'Нет описания')}</Text>
            </View>
        </Pressable>
    )
})

export default AnimeItem;