import { ContextMenu } from "@/components/ContextComponent"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useUserStore } from "@/store/userStore"
import { deleteFolder } from "@/utils/firebase/userFolders"
import { router } from "expo-router"
import { memo } from "react"
import { Alert, Dimensions, Pressable, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 20.5;

interface FolderListProps {
    userId: string;
    openCreateFolder: (v: boolean) => void;
    editFolder: ({ edit, name, color }: { edit: boolean, name: string, color: string }) => void
}

function FolderList({ userId, openCreateFolder, editFolder }: FolderListProps) {
    const folders = useUserStore(s => s.user?.folders);
    if (!folders) return;
    return (
        <>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', paddingBottom: 10 }}>Папки</Text>
            <View style={{ alignItems: 'center', backgroundColor: '#1c1c1e', padding: 10, borderRadius: 14, gap: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                {folders.map((item, index) => (
                    <ContextMenu key={`folder-${item.name}-${index}`}
                        triggerItem={
                            <Animated.View entering={FadeIn.delay(100 * index + 1)}>
                                <Pressable
                                    onPress={() => router.push({ pathname: '/folder', params: { name: item.name, ids: item.anime } })}
                                    style={{ backgroundColor: '#303034ff', padding: 15, paddingHorizontal: 30, borderRadius: 10, gap: 10, minWidth: ITEM_WIDTH, maxWidth: ITEM_WIDTH, alignItems: 'center' }}>
                                    <IconSymbol name="folder.fill" size={28} color={item.color} />
                                    <Text style={{ color: "white" }} numberOfLines={1}>{item.name}</Text>
                                </Pressable>
                            </Animated.View>
                        }
                        items={[
                            { title: 'Изменить', onSelect: () => { editFolder({ edit: true, name: item.name, color: item.color }); openCreateFolder(true); } },
                            {
                                title: 'Удалить', onSelect: () =>
                                    Alert.alert(`Вы уверенны что хотите удлаить папку ${item.name}?`,
                                        '',
                                        [
                                            { text: "Отмена", style: 'cancel' },
                                            { text: "Удалить", style: 'destructive', onPress: () => deleteFolder(userId, item.name) }
                                        ]),
                                destructive: true
                            },
                        ]}
                    />

                ))}
                {folders.length < 9 &&
                    <Animated.View entering={FadeIn} key={`create-folder`}>
                        <Pressable
                            onPress={() => openCreateFolder(true)}
                            style={{ backgroundColor: '#303034ff', padding: 15, paddingHorizontal: 30, borderRadius: 10, gap: 10, minWidth: ITEM_WIDTH, maxWidth: ITEM_WIDTH, alignItems: 'center' }}>
                            <IconSymbol name="folder.fill.badge.plus" size={28} color="white" />
                            <Text style={{ color: "white" }} numberOfLines={1}>Создать</Text>
                        </Pressable>
                    </Animated.View>
                }
            </View>

        </>
    )
}

export default memo(FolderList)