import { ContextMenu } from "@/components/ContextComponent"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/hooks/ThemeContext"
import { deleteFolder } from "@/lib/firebase/userFolders"
import { useUserStore } from "@/store/userStore"
import { LiquidGlassView as GlassView, isLiquidGlassSupported } from "@callstack/liquid-glass"
import { router } from "expo-router"
import { memo, useCallback } from "react"
import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useShallow } from "zustand/shallow"

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 24;

interface FolderListProps {
    userId: string;
    openCreateFolder: (v: boolean) => void;
    editFolder: ({ edit, name, color }: { edit: boolean, name: string, color: string }) => void
}

function FolderList({ userId, openCreateFolder, editFolder }: FolderListProps) {
    const isDarkMode = useTheme().theme === 'dark';
    const { folders } = useUserStore(
        useShallow((s) => ({
            folders: s.user?.folders
        }))
    );

    if (!folders) return;

    const confirmDelete = useCallback((folderName: string) => {
        Alert.alert(
            `Удалить папку ${folderName}?`,
            "Это действие нельзя отменить",
            [
                { text: "Отмена", style: "cancel" },
                { text: "Удалить", style: "destructive", onPress: () => deleteFolder(userId, folderName) },
            ]
        );
    }, []);

    const handleNavigate = useCallback((name: string, ids: number[]) => () =>
        router.push({ pathname: "/(screens)/folder", params: { name, ids } }),
        []);

    return (
        <View>
            <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingBottom: 10, paddingLeft: 10 }}>Коллекции</ThemedText>
            <GlassView
                colorScheme={isDarkMode ? "dark" : 'light'}
                effect={'clear'}
                style={[styles.container, {
                    ...(!isLiquidGlassSupported && { backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3" }),
                }]}
            >
                {folders.map((item, index) => (
                    <ContextMenu key={`folder-${item.name}-${index}`}
                        triggerItem={
                            <Animated.View entering={FadeIn.delay(100 * index + 1)} style={{ borderRadius: 10, }}>
                                <Pressable
                                    onLongPress={null}
                                    onPress={handleNavigate(item.name, item.anime)}
                                    style={[
                                        styles.folder,
                                        {
                                            backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3"
                                        }
                                    ]}
                                >
                                    <IconSymbol
                                        name="folder.fill"
                                        size={28} color={item.color}
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowRadius: 6,
                                            shadowOpacity: 0.25,
                                        }}
                                    />
                                    <ThemedText numberOfLines={1}>{item.name}</ThemedText>
                                </Pressable>
                            </Animated.View>
                        }
                        items={[
                            { title: 'Изменить', iconName: 'pencil.and.scribble', onSelect: () => { editFolder({ edit: true, name: item.name, color: item.color }); openCreateFolder(true); } },
                            { title: 'Удалить', iconName: 'trash.fill', iconColor: 'red', onSelect: () => confirmDelete(item.name), destructive: true },
                        ]}
                    />
                ))}
                {folders.length < 9 &&
                    <Animated.View entering={FadeIn} key={`create-folder`}>
                        <Pressable onPress={() => openCreateFolder(true)}
                            style={[
                                styles.folder,
                                {
                                    backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3",
                                    height: 85,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <IconSymbol
                                name="folder.fill.badge.plus"
                                size={34} color="white"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowRadius: 6,
                                    shadowOpacity: 0.25,
                                }}
                            />
                            {/* <ThemedText numberOfLines={1}>Создать</ThemedText> */}
                        </Pressable>
                    </Animated.View>
                }
            </GlassView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
    },
    folder: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 14,
        gap: 10,
        minWidth: ITEM_WIDTH,
        maxWidth: ITEM_WIDTH,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
    }
})

export default memo(FolderList)