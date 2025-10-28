import { ContextMenu } from "@/components/ContextComponent"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { deleteFolder } from "@/lib/firebase/userFolders"
import { useUserStore } from "@/store/userStore"
import { GlassView } from "expo-glass-effect"
import { router } from "expo-router"
import { memo, useCallback } from "react"
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useShallow } from "zustand/shallow"

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 20.5;

interface FolderListProps {
    userId: string;
    openCreateFolder: (v: boolean) => void;
    editFolder: ({ edit, name, color }: { edit: boolean, name: string, color: string }) => void
}

function FolderList({ userId, openCreateFolder, editFolder }: FolderListProps) {
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
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', paddingBottom: 10 }}>Папки</Text>
            <GlassView tintColor="black" style={styles.container}>
                {folders.map((item, index) => (
                    <ContextMenu key={`folder-${item.name}-${index}`}
                        triggerItem={
                            <Animated.View entering={FadeIn.delay(100 * index + 1)} style={{ borderRadius: 10, }}>
                                <Pressable
                                    onPress={handleNavigate(item.name, item.anime)}
                                    style={styles.folder}>
                                    <IconSymbol name="folder.fill" size={28} color={item.color} />
                                    <Text style={{ color: "white" }} numberOfLines={1}>{item.name}</Text>
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
                        <Pressable onPress={() => openCreateFolder(true)} style={styles.folder}>
                            <IconSymbol name="folder.fill.badge.plus" size={28} color="white" />
                            <Text style={{ color: "white" }} numberOfLines={1}>Создать</Text>
                        </Pressable>
                    </Animated.View>
                }
            </GlassView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 14,
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    folder: {
        backgroundColor: '#303034ff',
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        gap: 10,
        minWidth: ITEM_WIDTH,
        maxWidth: ITEM_WIDTH,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 6
    }
})

export default memo(FolderList)