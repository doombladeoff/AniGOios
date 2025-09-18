import { ScrollPage, UIPage } from "@/components/Screens/Settings/Page";
import SettingSection from "@/components/Screens/Settings/SettingSection";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { auth } from "@/lib/firebase";
import { updateExp } from "@/utils/firebase/userRangUpdate";
import { storage } from "@/utils/storage";
import { Button, Host, HStack, Image, Section, Spacer, Switch as UISwitch, Text as UIText, TextField as UITextField } from "@expo/ui/swift-ui";
import { background, clipShape, cornerRadius, frame, padding } from "@expo/ui/swift-ui/modifiers";
import * as BackgroundTask from "expo-background-task";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";

export default function DevSettingsScreen() {
    const [expAmmount, setExpAmmount] = useState<number>(2);

    useEffect(() => {
        if (expAmmount > (100 * 100))
            setExpAmmount(100 * 100)
    }, [expAmmount]);

    const [useToast, setUseToast] = useState(storage.getUseToast() ?? false);
    const [useTestHeader, setUseTestHeader] = useState(storage.getUseTestHeader() ?? false);

    const useNativeUI = true;

    if (!useNativeUI)
        return (
            <ScrollPage>
                <SettingSection label="DEV">
                    <Pressable onPress={async () => await BackgroundTask.triggerTaskWorkerForTestingAsync()}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Завершить задачу
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => Alert.alert('Очистить данные?', '', [{ text: 'Отмена', style: 'cancel' }, { text: 'Очистить', onPress: () => storage.clearALL(), style: 'destructive' }])}>
                        <Text style={{ color: 'red', fontSize: 16 }}>
                            Очистить данные
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => { router.push({ pathname: '/(experemental)' }) }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Experemental</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>

                    <Pressable
                        onPress={() => { router.push({ pathname: '/List' }) }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Test List</Text>
                        <IconSymbol name='chevron.right' size={22} color={"gray"} />
                    </Pressable>
                </SettingSection>

                <SettingSection label="???">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Показывать уведомление Toast</Text>
                        <Switch
                            value={useToast}
                            onValueChange={(v: boolean) => { setUseToast(v); storage.setUseToast(v) }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Тестовый header</Text>
                        <Switch
                            value={useTestHeader}
                            onValueChange={(v: boolean) => { setUseTestHeader(v); storage.setUseTestHeader(v) }}
                        />
                    </View>
                </SettingSection>

                <SettingSection label="Уровень">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Количество exp</Text>
                        <TextInput
                            value={String(expAmmount)}
                            keyboardType='number-pad'
                            onChangeText={(t) => setExpAmmount(Number(t))}
                            style={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                        />
                    </View>
                    <Pressable onPress={async () => { auth.currentUser && updateExp(auth.currentUser?.uid, expAmmount, 'plus'); }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Добавить
                        </Text>
                        <IconSymbol name="plus.square.fill" size={24} color="white" />
                    </Pressable>
                    <Pressable onPress={async () => auth.currentUser && updateExp(auth.currentUser?.uid, expAmmount, 'minus')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Отнять
                        </Text>
                        <IconSymbol name="minus.square.fill" size={24} color="white" />
                    </Pressable>
                    <Pressable onPress={async () => auth.currentUser && updateExp(auth.currentUser?.uid, 0, 'reset')}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Обнулить
                        </Text>
                    </Pressable>
                </SettingSection>
            </ScrollPage>
        )

    return (
        <UIPage>
            <Section>
                <Button>
                    <UIText>Завершить задачу</UIText>
                </Button>
                <Button>
                    <UIText>Очистить данные</UIText>
                </Button>

                <Link href={{ pathname: '/(experemental)' }} asChild>
                    <Button>
                        <HStack spacing={8}>
                            <UIText color="primary">Experemental</UIText>
                            <Spacer />
                            <Image
                                systemName="chevron.right"
                                size={14}
                                color="secondary"
                            />
                        </HStack>
                    </Button>
                </Link>

                <Link href={{ pathname: '/(experemental)/list' }} asChild>
                    <Button>
                        <HStack spacing={8}>
                            <UIText color="primary">DEV</UIText>
                            <Spacer />
                            <Image
                                systemName="chevron.right"
                                size={14}
                                color="secondary"
                            />
                        </HStack>
                    </Button>
                </Link>
            </Section>

            <Section title="????">
                <UISwitch
                    label="Показвыать уведомление Toast"
                    value={useToast}
                    onValueChange={(v: boolean) => { setUseToast(v); storage.setUseToast(v) }}
                />
                <UISwitch
                    label="Тестовый header"
                    value={useTestHeader}
                    onValueChange={(v: boolean) => { setUseTestHeader(v); storage.setUseTestHeader(v) }}
                />
            </Section>

            <Section title="Уровень">
                <HStack>
                    <UIText>Количество EXP</UIText>
                    <Spacer />
                    <HStack modifiers={[frame({ height: 30, width: 100 }), background('rgba(100,100,100, 0.3)'), cornerRadius(100)]}>
                        <UITextField
                            keyboardType='phone-pad'
                            defaultValue={expAmmount.toString()}
                            onChangeText={(t) => setExpAmmount(Number(t))}
                            modifiers={[padding({ horizontal: 20 })]}
                        />
                    </HStack>
                </HStack>

                <Button onPress={async () => { auth.currentUser && updateExp(auth.currentUser?.uid, expAmmount, 'plus') }}>
                    <HStack spacing={10}>
                        <UIText color="white">Добавить</UIText>
                        <Image systemName="plus" size={16}
                            color="white"
                            modifiers={[
                                frame({ width: 28, height: 28 }),
                                background("#007aff"),
                                clipShape("roundedRectangle"),
                            ]}
                        />
                    </HStack>
                </Button>

                <Button onPress={async () => { auth.currentUser && updateExp(auth.currentUser?.uid, expAmmount, 'minus') }}>
                    <HStack spacing={10}>
                        <UIText color="red">Отнять</UIText>
                        <Image systemName="minus" size={16}
                            color="white"
                            modifiers={[
                                frame({ width: 28, height: 28 }),
                                background("#ff0000ff"),
                                clipShape("roundedRectangle"),
                            ]}
                        />
                    </HStack>
                </Button>

                <Host matchContents>
                    <Button onPress={async () => { auth.currentUser && updateExp(auth.currentUser?.uid, expAmmount, 'reset') }}>
                        <UIText color="red">Обнулить</UIText>
                    </Button>
                </Host>

            </Section>
        </UIPage>
    )
}