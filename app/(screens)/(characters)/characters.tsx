import { IconSymbol } from "@/components/ui/IconSymbol";
import { useScrollOpacity } from "@/hooks/useScrollOpacity";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const { width, height } = Dimensions.get('screen');

export default function CharactersScreen() {
    const headerHeight = useHeaderHeight();
    const { charactersShiki: b } = useLocalSearchParams<{ characters: string, charactersShiki: string }>();
    const charactersShiki = JSON.parse(b);
    const { animatedStyle, scrollHandler } = useScrollOpacity(200);

    return (
        <View>
            <Animated.View style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 100 }, animatedStyle]}>
                <LinearGradient colors={['black', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']} style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 200 }]} pointerEvents='none' />
            </Animated.View>
            <Animated.FlatList
                onScroll={scrollHandler}
                data={charactersShiki}
                numColumns={3}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push({ pathname: '/(screens)/(characters)/[id]', params: { id: item.character.id } })} style={{ marginBottom: 10, width: (width / 3), padding: 5 }}>
                        {item?.character.poster ? (
                            <Image source={{ uri: item?.character.poster.mainUrl }} style={{ width: (width / 3) - 10, height: 170, borderRadius: 12, marginRight: 10 }} />
                        ) : (
                            <View style={{ width: (width / 3) - 12.5, height: 170, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                <IconSymbol name='questionmark' color='gray' size={60} />
                            </View>
                        )}
                        <Text style={{ color: 'white', fontSize: 14, marginTop: 5, textAlign: 'left' }}>{item.character.russian}</Text>
                    </Pressable>

                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: headerHeight + 10, paddingBottom: headerHeight / 2 }}
            />
        </View>
    );
}