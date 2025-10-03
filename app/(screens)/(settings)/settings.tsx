import { UIPage } from "@/components/Screens/Settings/Page";
import { useTheme } from "@/hooks/ThemeContext";
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { Button, HStack, Picker, Section, Spacer, Switch, Image as UIImage, Text as UIText } from "@expo/ui/swift-ui";
import { ExternalPathString, Link, RelativePathString, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export default function SettingsScreen() {
    const { theme, mode, setMode } = useTheme();
    //Player
    const [isDefaultPlayer, setIsDefaultPlayer] = useState<boolean>(storage.getDefaultPlayer() ?? false);
    const [skipOpening, setSkipOpening] = useState<boolean>(storage.getSkipOpening() ?? false);
    const quality = ['720', '480', '360'];
    const [selectedQuality, setSelectedQuality] = useState<number>(Number(storage.getQuality()) ?? 0);
    const seekArr = ['10сек', '30сек'];
    const [selectedSeekTime, setSelectedSeekTime] = useState<number>(storage.getSkipTime() ?? 0);
    const [saveEpisodeTime, setSaveEpisodeTime] = useState<boolean>(storage.getSaveEpisodeTime() ?? false);

    const [cleared, setCleared] = useState(false);

    const resetDefaults = () => {
        setIsDefaultPlayer(storage.getDefaultPlayer() ?? false);
        setSkipOpening(storage.getSkipOpening() ?? false);
        setSaveEpisodeTime(storage.getSaveEpisodeTime() ?? false);
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

    return (
        <UIPage>
            <Link href={'/editProfile'} asChild>
                <Button>
                    <HStack spacing={8}>
                        <UIText color="primary">Редактировать профиль</UIText>
                        <Spacer />
                        <UIImage
                            systemName="chevron.right"
                            size={14}
                            color="secondary"
                        />
                    </HStack>
                </Button>
            </Link>

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

            <Section title="Тема" modifiers={[
            ]}>
                <Switch
                    label="Светлая"
                    value={mode === 'light'}
                    onValueChange={(v) => {
                        setMode('light')
                    }}
                />
                <Switch
                    label="Темная"
                    value={mode === 'dark'}
                    onValueChange={(v) => {
                        setMode('dark')
                    }}
                />

                <Switch
                    label="Системная"
                    value={mode === 'system'}
                    onValueChange={(v) => {
                        setMode('system')
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
        </UIPage>
    )
};