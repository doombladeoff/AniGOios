import { auth } from "@/lib/firebase";
import { useAnimeStore } from "@/store/animeStore";
import { Button, ContextMenu, Host, Submenu } from "@expo/ui/swift-ui";
import { Image } from "expo-image";
import { router } from "expo-router";
import { IconSymbol } from "../IconSymbol";

export const UserTab = ({ isFocused, color }: { isFocused: boolean; color: string }) => {
    return (
        <>
            {auth.currentUser ? (
                <Host style={{ width: 28, height: 28 }}>
                    <ContextMenu activationMethod='longPress'>
                        <ContextMenu.Items>
                            {__DEV__ &&
                                <Button role='destructive' onPress={() => useAnimeStore.getState().clearAnimeMap()}>
                                    Очистить AnimeMap
                                </Button>
                            }
                            <Submenu
                                key={'settings'}
                                button={<Button systemImage={'gear'}>Settings</Button>}>
                                <Button
                                    onPress={() => router.push({ pathname: '/settings' })}
                                >
                                    Настройки
                                </Button>
                                <Button
                                    variant="bordered"
                                    systemImage="applepencil.and.scribble"
                                    onPress={() => router.push({ pathname: '/dev-settings' })}
                                >
                                    DEV настройки
                                </Button>
                            </Submenu>
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            {auth.currentUser && auth.currentUser.photoURL ? (
                                <Image
                                    source={{ uri: auth.currentUser && auth.currentUser.photoURL || '' }}
                                    style={{ width: 28, height: 28, borderRadius: 100, borderWidth: isFocused ? 1 : 0, borderColor: 'red' }}
                                />
                            ) : (
                                <IconSymbol name="person.fill" size={28} color={color} />
                            )}
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </Host>
            ) : (
                <IconSymbol
                    size={28}
                    name="person.fill"
                    color={color}
                />
            )}
        </>
    )
}