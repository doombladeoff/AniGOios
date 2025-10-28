import { useTheme } from "@/hooks/ThemeContext"
import { deleteFolder } from "@/lib/firebase/userFolders"
import { ContextMenu, Host, Image, Button as UIButton, Text as UIText } from "@expo/ui/swift-ui"
import { fixedSize, frame, shadow } from "@expo/ui/swift-ui/modifiers"
import { HeaderBackButton } from "@react-navigation/elements"
import { router } from "expo-router"
import { Alert, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

const HeaderDone = ({ onPress }: { onPress: () => void }) => {
    const isDarkMode = useTheme().theme === 'dark';
    const color = isDarkMode ? 'white' : 'black';

    return (
        <Host style={{ width: 60, height: 35 }} matchContents modifiers={[fixedSize(true)]}>
            <UIButton modifiers={[frame({ width: 60, height: 35 }), fixedSize(true)]} onPress={onPress}>
                <UIText color={color} modifiers={[frame({ width: 60, height: 35 }), fixedSize(true)]}>Готово</UIText>
            </UIButton>
        </Host>
    );
}

const HeaderBack = () => {
    const isDarkMode = useTheme().theme === 'dark';
    const color = isDarkMode ? 'white' : 'black';

    return (
        <HeaderBackButton onPress={router.back} tintColor={color} />
    );
}

const HeaderDelete = ({ onPress }: { onPress: () => void }) => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Host style={{ width: 35, height: 35 }}>
                <UIButton modifiers={[frame({ width: 35, height: 35 }), fixedSize(true)]} onPress={onPress}>
                    <Image color={'red'} systemName="trash" size={25} modifiers={[frame({ width: 35, height: 35 }), fixedSize(true)]} />
                </UIButton>
            </Host>
        </Animated.View>
    );
};

interface HeadeMenu {
    editMode: boolean;
    setEditMode: (v: boolean) => void;
    folderName: string;
    userUid: string;
}
const HeaderMenu = ({ editMode, setEditMode, folderName, userUid }: HeadeMenu) => {
    const isDarkMode = useTheme().theme === 'dark';
    const color = isDarkMode ? 'white' : 'black';

    const menuItems = [
        {
            title: 'Изменить',
            iconName: 'checklist',
            iconColor: isDarkMode ? 'white' : 'black',
            destructive: false,
            onSelect: () => { setEditMode(!editMode) }
        },
        {
            title: 'Удалить папку',
            iconName: 'trash',
            destructive: true,
            iconColor: 'red',
            onSelect: async () => {
                Alert.alert(
                    `Удалить`,
                    `Вы уверено что ходите удалить ${folderName} ?`,
                    [
                        {
                            text: 'Отмена',
                            style: 'default',
                            onPress: () => null
                        },
                        {
                            text: 'Удалить',
                            style: 'destructive',
                            onPress: () => deleteFolder(userUid, folderName).then(() => router.back())
                        }
                    ]
                )
            }
        }
    ];

    return (
        <View style={{ width: 35, height: 35 }}>
            <Host style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                <ContextMenu activationMethod='singlePress'>
                    <ContextMenu.Items>
                        {menuItems.map(el => (
                            <UIButton
                                key={el.title}
                                systemImage={el.iconName}
                                onPress={el.onSelect}
                                role={el.destructive ? 'destructive' : 'default'}
                            >
                                {el.title}
                            </UIButton>
                        ))}
                    </ContextMenu.Items>
                    <ContextMenu.Trigger>
                        <Host style={{ width: 35, height: 35 }}>
                            <UIButton modifiers={[shadow({ radius: 2, color: 'black' }), frame({ width: 35, height: 35 }), fixedSize(true)]}>
                                <Image color={color} systemName="ellipsis" size={25} modifiers={[frame({ width: 35, height: 35 }), fixedSize(true)]} />
                            </UIButton>
                        </Host>
                    </ContextMenu.Trigger>
                </ContextMenu>
            </Host>
        </View>
    );
};

export { HeaderBack, HeaderDelete, HeaderDone, HeaderMenu }

