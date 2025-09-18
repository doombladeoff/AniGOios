import { getCharacterJikan } from "@/API/Jikan/getCharacterJikan";
import { getCharacterShiki } from "@/API/Shikimori/getCharacterShiki";
import { VoiceOversStack } from "@/components/Anime/Details/Characters";
import { GradientBlur } from "@/components/GradientBlur";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useScrollOpacity } from "@/hooks/useScrollOpacity";
import { cleanDescription } from "@/utils/cleanDescription";

import { BottomSheet, Button, Host, HStack, Spacer, Image as UIImage, Text as UIText, VStack } from "@expo/ui/swift-ui";
import { background, cornerRadius, padding } from "@expo/ui/swift-ui/modifiers";

import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CharacterScreen() {
    const { id } = useLocalSearchParams();
    console.log(id)
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    const [loading, setLoading] = useState(true);
    const [character, setCharacter] = useState<{ d1: any, d2: any }>({
        d1: null,
        d2: null,
    })

    const [bottomOpened, setBottomOpened] = useState(false);
    const { width } = useWindowDimensions();

    const getData = async () => {
        try {
            setLoading(true)
            const [response, response2] = await Promise.all([
                getCharacterShiki(Number(id)),
                getCharacterJikan(id as string),
            ])
            setCharacter({ d1: response[0], d2: response2 });
            setLoading(false)
            console.log({ d1: response, d2: response2 })
        } catch (error) {
            console.error(error);
            setLoading(false)
        }

    }

    useEffect(() => { if (!character.d1) getData() }, [id]);
    const { animatedStyle, scrollHandler } = useScrollOpacity(200);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={'white'} />
            </View>
        )
    }

    return (
        <>
            <Fragment>
                <GradientBlur
                    colors={colors}
                    locations={locations}
                    containerStyle={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 1, width, height: insets.top * 2.5,
                    }}
                    tint="light"
                    blurIntensity={20}
                />
                <Animated.View style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight / 4, zIndex: 1 }, animatedStyle]}>
                    <LinearGradient colors={['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']} style={[StyleSheet.absoluteFill, { width: '100%', height: headerHeight, zIndex: 200 }]} pointerEvents='none' />
                </Animated.View>
            </Fragment>

            <View style={{ position: 'absolute', width: '100%', height: 500, zIndex: 0, top: 0 }}>
                <Image
                    source={{ uri: character.d1.poster.mainUrl }}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: 1,
                    }}
                    blurRadius={30}
                    transition={500}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'black']}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                    }}
                />
            </View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                contentContainerStyle={{ paddingTop: headerHeight + 20, paddingBottom: insets.bottom }}
            >
                <Image
                    source={{ uri: character.d1.poster.mainUrl }}
                    style={{
                        width: 180,
                        height: 240,
                        borderRadius: 8,
                        shadowColor: 'black',
                        shadowRadius: 4,
                        shadowOpacity: 0.5,
                        shadowOffset: { width: 0, height: 0 },
                        alignSelf: 'center',
                        zIndex: 3
                    }}
                />

                <View style={{ padding: 10, paddingTop: 0 }}>
                    <Pressable
                        onPress={() => setBottomOpened(true)}
                        style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center' }}
                    >
                        <Text style={{ color: 'white' }}>{character.d1.russian}</Text>
                        <IconSymbol name='questionmark.circle.fill' size={18} color={'white'} />
                    </Pressable>

                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', paddingLeft: 5, paddingBottom: 5 }}>Описание</Text>
                    <View style={{ backgroundColor: 'rgba(108, 108, 108, 0.45)', borderRadius: 12, padding: 10, gap: 5 }}>
                        <Text style={{ color: 'white', fontSize: 16 }} numberOfLines={undefined}>{cleanDescription(character.d1.description || '')}</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <VoiceOversStack items={character.d2.voices} />
                    </View>

                </View>

            </Animated.ScrollView >

            <Host style={{ position: 'absolute', width }}>
                <BottomSheet
                    isOpened={bottomOpened}
                    onIsOpenedChange={() => setBottomOpened(false)}
                >
                    <VStack spacing={15} modifiers={[padding({ all: 20 })]}>
                        <HStack>
                            <UIText color='white' size={18} weight="bold">Имена</UIText>
                            <Spacer />
                            <Button modifiers={[background('rgba(80,80,80, 0.5)'), cornerRadius(100)]} onPress={() => setBottomOpened(false)}>
                                <UIImage systemName="xmark" size={16} modifiers={[padding({ all: 10 })]} />
                            </Button>
                        </HStack>
                        {[
                            { lang: 'English:', name: character.d1.name },
                            { lang: 'Japanese:', name: character.d1.japanese },
                            { lang: 'Русский:', name: character.d1.russian },
                        ].map((item, index) => (
                            <HStack key={`lang-${item.lang}`} spacing={10}>
                                <UIText color='white'>{item.lang}</UIText>
                                <UIText color='white'>{item.name}</UIText>
                                <Spacer />
                            </HStack>
                        ))}
                    </VStack>
                </BottomSheet>
            </Host>
        </>
    )
}