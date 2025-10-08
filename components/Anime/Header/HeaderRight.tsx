import { useTheme } from "@/hooks/ThemeContext";
import { storage } from "@/utils/storage";
import { Button, ContextMenu, Host, Image } from "@expo/ui/swift-ui";
import { frame, shadow } from "@expo/ui/swift-ui/modifiers";
import { router } from "expo-router";
import { Items } from "../../ContextComponent/ContextMenu";

interface HeaderRightProps {
    img?: { crunch: string | undefined, def: string | undefined };
    customItems?: Items[]
}

export const HeaderRight = ({ img, customItems }: HeaderRightProps) => {
    const isDarkMode = useTheme().theme === 'dark';

    const item: Items[] = [
        {
            title: "Закрыть",
            iconName: "xmark",
            onSelect: () => { },
        },
        {
            title: "Очистить данные",
            onSelect: () => storage.clearALL(),
            destructive: true,
            iconName: 'trash.slash.square.fill',
        },
        {
            title: "Редактировать постер",
            iconName: 'pencil.and.scribble',
            onSelect: () =>
                router.push({
                    pathname: "/(screens)/(settings)/(edit)/posterEditor",
                    params: { src: JSON.stringify(img) },
                }),
        },
        ...(customItems ?? []),
    ];

    return (
        <Host>
            <ContextMenu activationMethod='singlePress'>
                <ContextMenu.Items>
                    {item.map(({ title, iconName, onSelect }) => (
                        <Button key={title} systemImage={iconName} onPress={onSelect}>
                            {title}
                        </Button>
                    ))}
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                    <Host style={{ width: 35, height: 35 }}>
                        <Button modifiers={[shadow({ radius: 2, color: 'black' })]}>
                            <Image color={isDarkMode ? 'white' : 'black'} systemName="ellipsis" size={25} modifiers={[frame({ width: 25, height: 35 })]} />
                        </Button>
                    </Host>
                </ContextMenu.Trigger>
            </ContextMenu>
        </Host>
    )
};