import { UIPage } from "@/components/Screens/Settings/Page";
import { auth } from "@/lib/firebase";
import { updateExp } from "@/lib/firebase/userRangUpdate";
import { storage } from "@/utils/storage";
import { Button, Host, HStack, Image, Section, Spacer, Switch as UISwitch, Text as UIText, TextField as UITextField } from "@expo/ui/swift-ui";
import { background, clipShape, cornerRadius, frame, padding } from "@expo/ui/swift-ui/modifiers";
import { useEffect, useState } from "react";

export default function DevSettingsScreen() {
    const [expAmmount, setExpAmmount] = useState<number>(2);

    useEffect(() => {
        if (expAmmount > (100 * 100))
            setExpAmmount(100 * 100)
    }, [expAmmount]);

    const [useToast, setUseToast] = useState(storage.getUseToast() ?? false);
    const [useTestHeader, setUseTestHeader] = useState(storage.getUseTestHeader() ?? false);
    const [searchPageRole, setSearchPageRole] = useState(storage.getSearchPageRole() ?? false);

    return (
        <UIPage>
            <Button role='destructive'>
                <UIText>Завершить задачу</UIText>
            </Button>

            <Button onPress={()=> storage.clearALL()}>
                <UIText>Очистить данные</UIText>
            </Button>

            <Section title="????">
                <UISwitch
                    label="SearchPage set role"
                    value={searchPageRole}
                    onValueChange={(v) => { setSearchPageRole(v); storage.setSearchPageRole(v) }}
                />

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