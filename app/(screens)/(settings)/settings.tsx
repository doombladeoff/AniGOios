import { ScrollPage, UIPage } from "@/components/Screens/Settings/Page";
import SettingSection from "@/components/Screens/Settings/SettingSection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { Button, Host, HStack, Picker, Section, Spacer, Switch, Image as UIImage, Text as UIText } from "@expo/ui/swift-ui";
import { ExternalPathString, Link, RelativePathString, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform, Pressable, Switch as RNSwitch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [use3DPoster, setUse3DPoster] = useState(false);

    //Player
    const [isDefaultPlayer, setIsDefaultPlayer] = useState<boolean>(storage.getDefaultPlayer() ?? false);
    const [skipOpening, setSkipOpening] = useState<boolean>(storage.getSkipOpening() ?? false);
    const quality = ['720', '480', '360'];
    const [selectedQuality, setSelectedQuality] = useState<number>(Number(storage.getQuality()) ?? 0);
    const seekArr = ['10сек', '30сек'];
    const [selectedSeekTime, setSelectedSeekTime] = useState<number>(storage.getSkipTime() ?? 0);
    const [saveEpisodeTime, setSaveEpisodeTime] = useState<boolean>(storage.getSaveEpisodeTime() ?? false);

    const profileImageSizes = ['Large', 'Medium', 'Small'];
    const [selectedProfileImageSizeIndex, setSelectedProfileImageSizeIndex] = useState<number>(0);


    const [showRatingPoster, setShowRatingPoster] = useState(true);
    const [useScreenShadow, setUseScreenShadow] = useState(false);

    const [useDefaultBottomTabs, setUseDefaultBottomTabs] = useState(storage.getDefaultTabBar() ?? false);
    const [hideTitleBottomTabs, setHideTitleBottomTabs] = useState(storage.getUseTitleBottomTabs() ?? false);


    const [cleared, setCleared] = useState(false);

    const resetDefaults = () => {
        setIsDefaultPlayer(storage.getDefaultPlayer() ?? false);
        setSkipOpening(storage.getSkipOpening() ?? false);
        setSaveEpisodeTime(storage.getSaveEpisodeTime() ?? false);

        setUse3DPoster(false);
        setShowRatingPoster(true);

        setUseScreenShadow(false);

        setUseDefaultBottomTabs(storage.getDefaultTabBar() ?? false);
        setHideTitleBottomTabs(storage.getUseTitleBottomTabs() ?? false);
    };

    const handleClear = useCallback(async () => {
        storage.clearALL();
        setCleared(true);
    }, []);

    useEffect(() => {
        if (cleared) {
            resetDefaults();
            setCleared(false);
        }
    }, [cleared]);

    const useNativeSettings = true;
    if (!useNativeSettings)
        return (
            <ScrollPage
                contentContainerStyle={{ paddingBottom: insets.bottom }}
                scrollIndicatorInsets={{ bottom: insets.bottom }}
            >
                <SettingSection label="UI Settgins">
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Стандартные вкладки</Text>
                        <RNSwitch
                            value={useDefaultBottomTabs}
                            onValueChange={(v) => {
                                setUseDefaultBottomTabs(!useDefaultBottomTabs);
                                storage.setDefaultTabBar(v);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Скрыть имена иконок снизу</Text>
                        <RNSwitch
                            value={hideTitleBottomTabs}
                            onValueChange={(v) => {
                                setHideTitleBottomTabs(!hideTitleBottomTabs);
                                storage.setUseTitleBottomTabs(v);
                            }}
                        />
                    </View>
                </SettingSection>

                <SettingSection label="Плеер">
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Стандартный плеер</Text>
                        <RNSwitch

                            value={isDefaultPlayer}
                            onValueChange={(v) => { setIsDefaultPlayer(!isDefaultPlayer); storage.setDefaultPlayer(v) }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Пропускать опенинги</Text>
                        <RNSwitch
                            value={skipOpening}
                            onValueChange={(v) => {
                                setSkipOpening(!skipOpening);
                                storage.setSkipOpening(v);
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Качество</Text>
                        <Host matchContents>
                            <Picker
                                variant="menu"
                                label="Качество"
                                options={quality}
                                color="white"
                                selectedIndex={selectedQuality}
                                onOptionSelected={({ nativeEvent: { index } }) => {
                                    setSelectedQuality(index);
                                    storage.setQuality(String(index));
                                }}
                            />
                        </Host>
                    </View>

                </SettingSection>

                <SettingSection label="Кастомный плеер">
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <Text style={{ color: 'white', fontSize: 16, flexShrink: 1 }}>Продолжать эпизод с последнего момента</Text>
                        <RNSwitch
                            value={saveEpisodeTime}
                            onValueChange={(v) => {
                                setSaveEpisodeTime(!saveEpisodeTime);
                                storage.setSaveEpisodeTime(v);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Перемотать на</Text>
                        <Host matchContents>
                            <Picker
                                variant="menu"
                                options={seekArr}
                                color="white"
                                selectedIndex={selectedSeekTime}
                                onOptionSelected={({ nativeEvent: { index } }) => {
                                    console.log(index)
                                    setSelectedSeekTime(index);
                                    storage.setSkipTime(index);
                                }}
                            />
                        </Host>
                    </View>
                </SettingSection>

                <SettingSection label="Другое">
                    <Pressable
                        onPress={() => router.push({ pathname: '/(screens)/(settings)/(edit)/posterEditor' })}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Редактировать постер</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>

                    <Pressable
                        onPress={() => router.push({ pathname: '/(screens)/(settings)/(edit)/homeRecommends' })}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Настройка рекомендаций</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>
                </SettingSection>

                <SettingSection label="DEV">
                    <Pressable
                        onPress={() => {
                            Alert.prompt(
                                "Введите ID",
                                'id - malID',
                                [
                                    { text: 'Отмена', style: 'cancel' },
                                    {
                                        text: "Перейти",
                                        onPress: (v: any) => router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: Number(v) } }),
                                        style: 'default',
                                    }
                                ],
                                'plain-text',
                                '',
                                'numeric'
                            );
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Перейти к аниме по ID</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>


                    <Pressable
                        onPress={() => { router.push({ pathname: '/dev-settings' }) }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>DEV</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>

                    <Pressable onPress={() => { handleClear() }}>
                        <Text style={{ color: 'red', fontSize: 16 }}>
                            Сбросить настройки
                        </Text>
                    </Pressable>
                </SettingSection>

                <SettingSection label="">
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                        onPress={() => {
                            auth.signOut();
                            router.replace({ pathname: '/(auth)' })
                        }}>
                        <Text style={{ color: 'red', fontSize: 16, fontWeight: '500' }}>Выйти с аккаунта</Text>
                        <IconSymbol name='rectangle.portrait.and.arrow.right.fill' size={24} color={'red'} />
                    </Pressable>
                </SettingSection>
            </ScrollPage>
        )

    return (
        <UIPage>
            <Link href={'/editProfile'} asChild>
                <Button>
                    <HStack spacing={8}>
                        <UIText color="primary">Edit profile</UIText>
                        <Spacer />
                        <UIImage
                            systemName="chevron.right"
                            size={14}
                            color="secondary"
                        />
                    </HStack>
                </Button>
            </Link>

            {Platform.Version < '26.0' &&
                <Section title="UI Settings">
                    <Switch
                        label="Стандартные вкладки"
                        value={useDefaultBottomTabs}
                        onValueChange={(v) => {
                            setUseDefaultBottomTabs(!useDefaultBottomTabs);
                            storage.setDefaultTabBar(v);
                        }}
                    />
                    <Switch
                        label="Скрыть имена иконок снизу"
                        value={hideTitleBottomTabs}
                        onValueChange={(v) => {
                            setHideTitleBottomTabs(!hideTitleBottomTabs);
                            storage.setUseTitleBottomTabs(v);
                        }}
                    />
                </Section>
            }


            <Section title="Плеер">
                <Switch
                    label="Стандартный плеер"
                    value={isDefaultPlayer}
                    onValueChange={(v) => { setIsDefaultPlayer(!isDefaultPlayer); storage.setDefaultPlayer(v) }}
                />

                <Switch
                    label="Пропускать опенинги"
                    value={skipOpening}
                    onValueChange={(v) => {
                        setSkipOpening(!skipOpening);
                        storage.setSkipOpening(v);
                    }}
                />

                <HStack>
                    <UIText>Качество</UIText>
                    <Spacer />
                    <Picker
                        variant="menu"
                        options={quality}
                        color='red'
                        selectedIndex={selectedQuality}
                        onOptionSelected={({ nativeEvent: { index } }) => {
                            setSelectedQuality(index);
                            storage.setQuality(String(index));
                        }}
                    />
                </HStack>
            </Section>

            <Section title="Кастомный плеер">
                <Switch
                    label="Продолжать эпизод с последнего момента"
                    value={saveEpisodeTime}
                    onValueChange={(v) => {
                        setSaveEpisodeTime(!saveEpisodeTime);
                        storage.setSaveEpisodeTime(v);
                    }}
                />
                <Picker
                    variant="menu"
                    label="Перемотать на"
                    options={seekArr}
                    color="white"
                    selectedIndex={selectedSeekTime}
                    onOptionSelected={({ nativeEvent: { index } }) => {
                        console.log(index)
                        setSelectedSeekTime(index);
                        storage.setSkipTime(index);
                    }}
                />
            </Section>

            <Section title="Другое">
                {
                    [
                        {
                            link: '/(screens)/(settings)/(edit)/posterEditor',
                            title: 'Редактировать постер',
                        },
                        {
                            link: '/(screens)/(settings)/(edit)/homeRecommends',
                            title: 'Настройка рекомендаций',
                        }
                    ].map((item, index) => (
                        <Link key={`item-${index}`} href={item.link as RelativePathString | ExternalPathString} asChild>
                            <Button>
                                <HStack spacing={8}>
                                    <UIText color="primary">{item.title}</UIText>
                                    <Spacer />
                                    <UIImage
                                        systemName="chevron.right"
                                        size={14}
                                        color="secondary"
                                    />
                                </HStack>
                            </Button>
                        </Link>
                    ))
                }
            </Section>

            <Section title="DEV">
                <Button
                    onPress={() => {
                        Alert.prompt(
                            "Введите ID",
                            'id - malID',
                            [
                                { text: 'Отмена', style: 'cancel' },
                                {
                                    text: "Перейти",
                                    onPress: (v: any) => router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: Number(v) } }),
                                    style: 'default',
                                }
                            ],
                            'plain-text',
                            '',
                            'numeric'
                        );
                    }}
                >
                    <HStack spacing={8}>
                        <UIText color="primary">Перейти к аниме по ID</UIText>
                        <Spacer />
                        <UIImage
                            systemName="chevron.right"
                            size={14}
                            color="secondary"
                        />
                    </HStack>
                </Button>

                <Link href={'/dev-settings'} asChild>
                    <Button>
                        <HStack spacing={8}>
                            <UIText color="primary">DEV</UIText>
                            <Spacer />
                            <UIImage
                                systemName="chevron.right"
                                size={14}
                                color="secondary"
                            />
                        </HStack>
                    </Button>
                </Link>

                <Button
                    onPress={handleClear} role='destructive'>
                    <HStack spacing={8} alignment="center">
                        <UIText color='red'>Сбросить настройки</UIText>
                        <UIImage
                            systemName="paintbrush.fill"
                            size={14}
                            color="red"
                        />
                    </HStack>
                </Button>
            </Section>

            <Host matchContents>
                <Button
                    onPress={() => {
                        auth.signOut();
                        router.replace({ pathname: '/(auth)' })
                    }}
                    role='destructive'
                >
                    <HStack spacing={8} alignment="center">
                        <UIText color='red'>Выйти с аккаунта</UIText>
                        <UIImage
                            systemName="rectangle.portrait.and.arrow.right.fill"
                            size={14}
                            color="red"
                        />
                    </HStack>
                </Button>
            </Host>

        </UIPage>
    )
};