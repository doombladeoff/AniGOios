import { UIButton } from "@/components/ui/Button"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { deleteFolder } from "@/lib/firebase/userFolders"
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui"
import { frame } from "@expo/ui/swift-ui/modifiers"
import { router } from "expo-router"
import { Alert, Text } from "react-native"

const HeaderDone = ({ onPress }: { onPress: () => void }) => {
    return (
        <Host>
            <Button onPress={onPress}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400', paddingHorizontal: 10 }}>Готово</Text>
            </Button>
        </Host>
    )
}

const HeaderBack = ({ onPress }: { onPress: () => void }) => {
    return (
        <Host>
            <Button onPress={onPress}>
                <IconSymbol name="arrow.left" size={26} color={'white'} style={{ marginLeft: 5 }} />
            </Button>
        </Host>
    )
}

const HeaderDelete = ({ onPress }: { onPress: () => void }) => {
    return (
        <UIButton
            width={35}
            height={35}
            onPressBtn={onPress}
            iconName="trash"
            iconSize={18}
            iconColor="red"
        />
    )
};

interface HeadeMenu {
    editMode: boolean;
    setEditMode: (v: boolean) => void;
    folderName: string;
    userUid: string;
}
const HeaderMenu = ({ editMode, setEditMode, folderName, userUid }: HeadeMenu) => {
    return (
        <Host style={{ width: 35, height: 35 }}>
            <ContextMenu>
                <ContextMenu.Items>
                    {[
                        { title: 'Изменить', iconName: 'checklist', destructive: false, onSelect: () => { setEditMode(!editMode) } },
                        {
                            title: 'Удалить папку', iconName: 'trash', destructive: true, onSelect: async () => {
                                Alert.alert(`Удалить папку  ${folderName} ?`, '', [{ text: 'Отмена', style: 'default', onPress: () => null }, {
                                    text: 'Удалить', style: 'destructive', onPress: () => deleteFolder(userUid, folderName).then(() => router.back())
                                }])
                            }
                        }
                    ].map((i, index) => (
                        <Button key={index} systemImage={i.iconName} role={i.destructive ? 'destructive' : 'default'} onPress={i.onSelect}>{i.title}</Button>
                    ))}
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                    <Button systemImage="ellipsis" modifiers={[frame({ width: 35, height: 35 })]} />
                </ContextMenu.Trigger>
            </ContextMenu>
        </Host>
    )
};

export { HeaderBack, HeaderDelete, HeaderDone, HeaderMenu }

