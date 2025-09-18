import { Card } from "@/components/Anime/Card";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SettingSection from "@/components/Screens/Settings/SettingSection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { storage } from "@/utils/storage";
import { Form, Host, Section, Switch as UISwitch, VStack } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

interface ChangeSettingsProps {
    type: '3D' | 'CrunchyPoster',

}

const useNativeUI = true;

export default function PosterEditorScreen() {
    const headerHeight = useHeaderHeight();

    const { src } = useLocalSearchParams<{ src?: string }>();

    let img: { crunch?: string; def?: string } | undefined;

    try {
        if (src) {
            img = JSON.parse(src);
        }
    } catch (e) {
        console.error("Ошибка парсинга постера:", e);
    }

    const [use3DPoster, setUse3DPoster] = useState(storage.get3DPoster() ?? false);
    const [useCrunchyPoster, setUseCrunchyPoster] = useState(storage.getCrunchyPoster() ?? true);
    const [showStatus, setSStatus] = useState(storage.getShowStatus() ?? true);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);


    async function ChangeSettings(type: ChangeSettingsProps, value: boolean) {
        switch (type.type) {
            case '3D':
                setUse3DPoster(value);
                setUseCrunchyPoster(false);

                storage.set3DPoster(true);
                storage.setCrunchyPoster(false);


                break;
            case 'CrunchyPoster':
                setUseCrunchyPoster(value);
                setUse3DPoster(false);

                storage.set3DPoster(false);
                storage.setCrunchyPoster(true);

                break;
            default:
                break;
        }

        console.log('ChangeSettings called with:', type, value);
        return;
    }


    useEffect(() => {
        const size = 60;
        const speed = 600;
        const runSquare = () => {
            opacity.value = 1;
            translateX.value = withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(0, { duration: 500 }), // пауза
                    withTiming(200, { duration: speed, easing: Easing.linear }), // вправо
                    withTiming(200, { duration: speed, easing: Easing.linear }), // вниз
                    withTiming(0, { duration: speed, easing: Easing.linear }), // влево
                    withTiming(0, { duration: speed, easing: Easing.linear }), // вверх
                ),
                3,
                false,
                () => { opacity.value = withTiming(0, { duration: 500 }); }
            );

            translateY.value = withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(0, { duration: 500 }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                    withTiming(240, { duration: speed, easing: Easing.linear }),
                    withTiming(240, { duration: speed, easing: Easing.linear }),
                    withTiming(0, { duration: speed, easing: Easing.linear }),
                ),
                3,
                false
            );

        };

        runSquare();
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        opacity: opacity.value,
    }));


    const Poster3D = () => {
        return (
            <View style={{ paddingTop: headerHeight + 20, }}>
                <View style={{ width: '100%', height: 300, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>

                    <Animated.View entering={FadeIn.delay(500).duration(1000)} style={[{ position: 'absolute', zIndex: 200000, top: 0, left: 80, }]} >
                        <Animated.View style={animatedStyle}>
                            <IconSymbol name="hand.point.up.left.fill" size={52} color={"white"} style={{ shadowColor: 'black', shadowRadius: 4, shadowOpacity: 1 }} />
                        </Animated.View>
                    </Animated.View>
                    <Card>
                        {showStatus &&
                            <Animated.View
                                entering={FadeIn}
                                style={{
                                    top: 5,
                                    zIndex: 200,
                                    position: 'absolute',
                                    shadowColor: 'black',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.65,
                                    shadowRadius: 8,
                                }}>
                                <Text style={{
                                    color: 'white',
                                    backgroundColor: 'skyblue',
                                    borderRadius: 6, top: 4,
                                    paddingHorizontal: 8, paddingVertical: 4,
                                    fontSize: 14, fontWeight: '500'
                                }}>STATUS</Text>
                            </Animated.View>
                        }
                        <Image priority={'high'} transition={500} source={{ uri: img ? img.def : `https://i.pinimg.com/736x/49/9b/6c/499b6c1c14d16216f328d6bc83258f01.jpg` }} style={{ width: 240, height: 340, borderRadius: 12 }} contentFit="cover" />
                    </Card>
                </View>
            </View>
        )
    };

    const CrunchPoster = () => {
        return (
            <View style={{ position: 'absolute', height: 540, width: '100%' }} pointerEvents="none">
                <LinearGradient colors={['transparent', 'rgba(0,0,0,1)']} style={[StyleSheet.absoluteFillObject, { height: 570, width: '100%', zIndex: 2 }]} />
                <Image
                    priority={'high'}
                    transition={500}
                    contentPosition={img ? 'top center' : 'center'}
                    source={{ uri: img ? img.crunch : `https://i.pinimg.com/736x/49/9b/6c/499b6c1c14d16216f328d6bc83258f01.jpg` }}
                    style={{ width: '100%', height: 640, top: -100, position: 'absolute', zIndex: 1 }}
                    contentFit="cover"
                    pointerEvents="none"
                />
            </View>
        )
    }

    return (
        <ParallaxScrollView
            HEADER_HEIGHT={use3DPoster ? 500 : 540}
            headerBackgroundColor={{ dark: 'black', light: 'black' }}
            headerImage={
                <>
                    {
                        use3DPoster && <Poster3D />
                    }

                    {
                        useCrunchyPoster && <CrunchPoster />
                    }
                </>
            }
            contentContainerStyle={{ paddingVertical: 20, paddingTop: headerHeight + 20 }}>
            <>
                {useNativeUI ? (
                    <Host matchContents style={{ zIndex: 1000, width: '100%', paddingTop: 20, backgroundColor: 'red' }}>
                        <Form modifiers={[frame({ height: 300 })]}>
                            <Section title="Постер">
                                <VStack spacing={0}>
                                    {
                                        [
                                            { label: 'Использовать 3D постер', value: use3DPoster, type: '3D' },
                                            { label: 'Crunchroll постер', value: useCrunchyPoster, type: "CrunchyPoster" },
                                        ].map((item, index) => (
                                            <VStack
                                                modifiers={[frame({ height: 50 })]}
                                                key={`item-poster-${index}`}
                                            >
                                                <UISwitch
                                                    label={item.label}
                                                    value={item.value}
                                                    onValueChange={(v: boolean) => ChangeSettings({ type: item.type as '3D' | 'CrunchyPoster' }, v)}
                                                />
                                            </VStack>

                                        ))
                                    }
                                </VStack>
                            </Section>

                            <UISwitch
                                label="Отображать статус"
                                value={showStatus}
                                onValueChange={(v: boolean) => { setSStatus(v); storage.setShowStatus(v) }}
                            />
                        </Form>
                    </Host>
                ) : (
                    <View style={{ paddingTop: 20, zIndex: 2000 }}>
                        <SettingSection label="Постер">
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Использовать 3D постер</Text>
                                <Switch
                                    value={use3DPoster}
                                    onValueChange={(v: boolean) => ChangeSettings({ type: '3D' }, v)}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Crunchroll постер</Text>
                                <Switch
                                    value={useCrunchyPoster}
                                    onValueChange={(v: boolean) => ChangeSettings({ type: 'CrunchyPoster' }, v)}
                                />
                            </View>
                        </SettingSection >

                        <SettingSection label="Статус">
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Отображать статус</Text>
                                <Switch
                                    value={showStatus}
                                    onValueChange={(v: boolean) => { setSStatus(v); storage.setShowStatus(v) }}
                                />
                            </View>
                        </SettingSection>
                    </View>
                )}
            </>
        </ParallaxScrollView>
    )
}