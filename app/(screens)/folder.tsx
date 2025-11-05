import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { AnimeFields } from "@/API/Shikimori/RequestFields.type";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { FolderItem } from "@/components/Screens/Folders/FolderItem";
import { HeaderBack, HeaderDelete, HeaderDone, HeaderMenu } from "@/components/Screens/Folders/FoldersHeader";
import BackgroundBlur from "@/components/ui/BackgroundBlur";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { removeAnimeFromFolder } from "@/lib/firebase/userFolders";
import { useUserStore } from "@/store/userStore";
import { ContentUnavailableView, Host } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fileds: AnimeFields = {
    malId: true,
    name: true,
    russian: true,
    poster: { main2xUrl: true },
    genres: {
        name: true,
        kind: true,
        russian: true,
        id: true
    },
    episodes: true,
    episodesAired: true,
    score: true,
    status: true,
    kind: true,
    description: true
}

export default function FolderScreen() {
    const { name, ids } = useLocalSearchParams<{ name: string, ids: string | string[] }>();
    const insets = useSafeAreaInsets();
    const isDarkMode = useTheme().theme === 'dark';

    const folderName = name.charAt(0).toUpperCase() + name.slice(1);
    const user = useUserStore(s => s.user);

    const [anime, setAnime] = useState<ShikimoriAnime[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        if (!ids || !user) return setLoading(false);

        await getAnimeList({ ids: ids as string }, fileds)
            .then((res) => {
                setAnime(res);
            })
            .catch(err => console.log('Ошибка в поулчении данных', err))
        setLoading(false);
    }

    useEffect(() => { fetch(); }, [])

    const handlePress = useCallback((id: string) => {
        if (!editMode) {
            router.push({ pathname: '/(screens)/anime/[id]', params: { id: id } })
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
        return (
            <FolderItem
                index={index}
                editMode={editMode}
                item={item}
                include={include}
                onPress={() => handlePress(String(item.malId))}
            />
        );
    };

    const handleHeaderRightButton = async () => {
        if (!user || !anime?.length) return;

        if (selectedIndex.length === 0) return;

        const folderTitle = folderName.charAt(0).toUpperCase() + folderName.slice(1);

        let message = '';
        const count = selectedIndex.length;
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        let word = 'элементов';
        if (lastTwoDigits < 11 || lastTwoDigits > 14) {
            if (lastDigit === 1) word = 'элемент';
            else if (lastDigit >= 2 && lastDigit <= 4) word = 'элемента';
        }

        if (selectedIndex.length === 1) {
            const item = anime.find(a => String(a.malId) === selectedIndex[0]);
            console.log(item);
            const title = item ? item.russian || item.english || item.name : 'элемент';
            message = `Вы уверены, что хотите удалить "${title}" из папки "${folderTitle}"?`;
        } else {
            message = `Вы уверены, что хотите удалить ${selectedIndex.length} ${word} из папки "${folderTitle}"?`;
        }

        Alert.alert(
            'Удалить',
            message,
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeAnimeFromFolder(user.uid, folderName, selectedIndex);

                            setAnime(prev => prev?.filter(a => !selectedIndex.includes(String(a.malId))));

                            setSelectedIndex([]);
                            setEditMode(false);
                        } catch (err) {
                            console.error('Failed to remove anime:', err);
                        }
                    },
                },
            ]
        );
    };

    const handleDone = () => {
        setSelectedIndex([]);
        setEditMode(false);
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                <BackgroundBlur />
                <ActivityIndicator size={'small'} />
                <ThemedText>Загрузка</ThemedText>
            </View>
        );
    };

    if (anime.length < 1) {
        return (
            <Host style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Stack.Screen
                    options={{
                        headerTitle: folderName,
                        headerLeft: () => <HeaderBack />
                    }}
                />
                <BackgroundBlur />
                <ContentUnavailableView
                    systemImage='questionmark.folder.fill'
                    title="Папка пуста"
                    description="Вы ещё не добавили сюда аниме. Найдите свои любимые сериалы и добавьте их в папку, чтобы быстро к ним возвращаться."
                    modifiers={[foregroundStyle({ type: 'color', color: isDarkMode ? 'white' : 'black' })]}
                />
            </Host>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: folderName,
                    headerLeft: () => (editMode ? <HeaderDone onPress={handleDone} /> : <HeaderBack />),
                    headerRight: () => (
                        editMode && selectedIndex.length > 0 ? (
                            <HeaderDelete onPress={handleHeaderRightButton} />
                        ) : (
                            <View>
                                {user &&
                                    <HeaderMenu
                                        setEditMode={setEditMode}
                                        folderName={folderName}
                                        editMode={editMode}
                                        userUid={user.uid}
                                    />
                                }
                            </View>

                        )
                    ),
                }}
            />
            <BackgroundBlur />
            <Animated.FlatList
                itemLayoutAnimation={LinearTransition}
                data={anime}
                keyExtractor={(item) => String(item.malId)}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{
                    padding: 10,
                    paddingBottom: insets.bottom,
                    gap: 10
                }}
                renderItem={renderItem}
                removeClippedSubviews
            />
        </>
    )
}