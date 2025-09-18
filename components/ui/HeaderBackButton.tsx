import { Button, Host, HStack, Image } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { router } from "expo-router";
import * as ContextMenu from 'zeego/context-menu';

const HeaderBackButton = ({ onPress }: { onPress?: () => void; }) => {
    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <Host style={{ width: 35, height: 35 }}>
                    <HStack modifiers={[frame({ width: 25, height: 25 })]}>
                        <Button onPress={() => onPress ? onPress() : router.back()}>
                            <Image systemName="arrow.left" size={25} color="white" />
                        </Button>
                    </HStack>
                </Host>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
                <ContextMenu.Item key="key" onSelect={() => router.back()}>
                    <ContextMenu.ItemTitle>Назад</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item key="key-1" onSelect={() => router.replace({ pathname: '/(tabs)/(home)/home' })}>
                    <ContextMenu.ItemTitle>На главную</ContextMenu.ItemTitle>
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Root>
    )
}

export default HeaderBackButton;