import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { FolderItem } from "@/components/Screens/Folders/FolderItem";
import { HeaderBack, HeaderDelete, HeaderDone, HeaderMenu } from "@/components/Screens/Folders/FoldersHeader";
import { removeAnimeFromFolder } from "@/lib/firebase/userFolders";
import { useUserStore } from "@/store/userStore";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fileds: AnimeFields = {
    malId: true,
    name: true,
    russian: true,
    poster: { main2xUrl: true },
    genres: {
        russian: true,
        id: true
    },
    episodes: true,
    episodesAired: true,
    score: true,
    status: true,
    kind: true
}

export default function FolderScreen() {
    const { name, ids } = useLocalSearchParams<{ name: string, ids: string | string[] }>();
    const folderName = name.charAt(0).toUpperCase() + name.slice(1);
    const user = useUserStore(s => s.user);
    const [anime, setAnime] = useState<ShikimoriAnime[]>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<string[]>([]);
    const insets = useSafeAreaInsets();

    const fetch = async () => {
        if (!ids || !user) return;

        try {
            const result = await getAnimeList({ ids: ids as string }, fileds);
            setAnime(result);
        } catch (error) {
            console.error("Failed to fetch anime:", error);
            return [];
        }
    }

    useEffect(() => { fetch(); }, [])

    const handlePress = useCallback((id: string) => {
        if (!editMode) {
            router.push({ pathname: '/(screens)/(anime)/[id]', params: { id: id } })
        } else {
            setSelectedIndex((prev) => {
                if (prev.includes(String(id))) {
                    return prev.filter((i) => i !== id);
                }
                return [...prev, id];
            });
        }
    }, [editMode]);

    const renderItem = ({ item, index }: { item: ShikimoriAnime, index: number }) => {
        const include = selectedIndex.includes(String(item.malId));
        return <FolderItem index={index} editMode={editMode} item={item} include={include} onPress={() => handlePress(String(item.malId))} />
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTitle: folderName,
                    headerLeft: () => (editMode ? <HeaderDone onPress={() => { setSelectedIndex([]), setEditMode(false) }} /> : <HeaderBack onPress={() => router.back()} />),
                    headerRight: () =>
                        editMode && selectedIndex.length > 0 ? (
                            <HeaderDelete onPress={async () => {
                                if (!user) return;

                                await removeAnimeFromFolder(user.uid, folderName, selectedIndex);

                                setAnime(prev => prev?.filter(item => !selectedIndex.includes(String(item.malId))));

                                setSelectedIndex([]);
                                setEditMode(false);
                            }}
                            />
                        ) : (
                            <HeaderMenu setEditMode={setEditMode} editMode={editMode} folderName={folderName} userUid={user?.uid || ''} />
                        ),
                }}
            />
            <Animated.FlatList
                itemLayoutAnimation={LinearTransition}
                data={anime}
                keyExtractor={(item) => String(item.malId)}
                contentContainerStyle={{
                    ...(Platform.Version >= '26.0' && { paddingTop: useHeaderHeight() }),
                    padding: 10,
                    paddingBottom: insets.bottom,
                    flex: (!ids || !anime || anime?.length < 1) ? 1 : undefined,
                }}
                renderItem={renderItem}
                removeClippedSubviews
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Пусто</Text>
                    </View>
                }
            />
        </View>
    )
}