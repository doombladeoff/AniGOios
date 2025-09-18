import { getAnimeList } from "@/API/Shikimori/RequestAnime";
import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types";
import { DropdownMenu } from "@/components/ContextComponent";
import { Score } from "@/components/RenderList/Score";
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TranslatedKind, TranslatedStatus } from "@/constants/TranslatedStatus";
import { useUserStore } from "@/store/userStore";
import { deleteFolder, removeAnimeFromFolder } from "@/utils/firebase/userFolders";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft, Layout, LinearTransition } from "react-native-reanimated";

export default function FolderScreen() {
    const { name, ids } = useLocalSearchParams<{ name: string, ids: string | string[] }>();
    const folderName = name.charAt(0).toUpperCase() + name.slice(1)
    const user = useUserStore(s => s.user);
    const [anime, setAnime] = useState<ShikimoriAnime[]>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<string[]>([]);

    const fetch = async () => {
        if (!ids) return;
        if (!user) return;
        const result = await getAnimeList({ ids: ids as string }, {
            malId: true,
            name: true,
            russian: true,
            poster: { main2xUrl: true },
            genres: { russian: true, id: true },
            episodes: true,
            episodesAired: true,
            score: true,
            status: true,
            kind: true
        })
        setAnime(result);
    }

    useEffect(() => { fetch(); }, [])

    return (
        <>
            <Stack.Screen options={{
                headerTitle: name as string,
                headerLeft: () => editMode ? <Pressable onPress={() => { setEditMode(false); setSelectedIndex([]) }}><Text style={{ color: 'white', fontSize: 16, textAlignVertical: 'center', top: 2.5 }}>Готово</Text></Pressable> : <HeaderBackButton />,
                headerRight: () => ((editMode && selectedIndex.length > 0) ? <Pressable
                    onPress={async () => {
                        if (!user) return;

                        await removeAnimeFromFolder(user.uid, folderName, selectedIndex);

                        setAnime(prev => prev?.filter(item => !selectedIndex.includes(String(item.malId))));

                        setSelectedIndex([]);
                        setEditMode(false);
                    }}
                ><IconSymbol name="trash" size={24} color={'red'} /></Pressable> : <DropdownMenu
                    triggerItem={<IconSymbol name="ellipsis" size={24} color='white' />}
                    items={[
                        { title: 'Изменить', iconName: 'checklist', onSelect: () => { editMode ? setEditMode(false) : setEditMode(true) } },
                        { title: 'Удалить папку', iconName: 'trash', onSelect: async () => { router.back(); user && deleteFolder(user?.uid, folderName) } }
                    ]}
                />)
            }} />
            <Animated.FlatList
                itemLayoutAnimation={LinearTransition}
                data={anime}
                keyExtractor={(item) => String(item.malId)}
                contentContainerStyle={{ gap: 0, padding: 10, flex: (!ids || !anime || anime?.length < 1) ? 1 : undefined }}
                renderItem={({ item }) => {
                    const include = selectedIndex.includes(String(item.malId));
                    return (
                        <Animated.View
                            layout={Layout.springify()}
                            entering={FadeInRight}
                            exiting={FadeOutLeft}
                        >
                            <Pressable
                                style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}
                                onPress={() => {
                                    if (!editMode) {
                                        router.push({ pathname: '/(screens)/[id]', params: { id: item.malId } })
                                    } else {
                                        setSelectedIndex((prev) => {
                                            if (prev.includes(String(item.malId))) {
                                                return prev.filter((i) => i !== String(item.malId));
                                            }
                                            return [...prev, String(item.malId)];
                                        });
                                    }
                                }}
                            >
                                {editMode && (
                                    <Animated.View
                                        entering={FadeInRight}
                                        exiting={FadeOutLeft}
                                        style={{ justifyContent: 'center', marginRight: 10 }}
                                    >
                                        <IconSymbol
                                            name={include ? 'checkmark.circle.fill' : 'circle'}
                                            size={24}
                                            color={'white'}
                                        />
                                    </Animated.View>
                                )}

                                <Score
                                    scoreText={item.score}
                                    scoreTextStyle={{
                                        color: "white",
                                        fontWeight: '600',
                                        position: 'absolute',
                                        left: 5,
                                        top: 5,
                                        zIndex: 1,
                                        backgroundColor: "green",
                                        borderRadius: 8,
                                        padding: 2,
                                        paddingHorizontal: 8
                                    }}
                                />
                                <Image
                                    source={{ uri: item.poster.main2xUrl }}
                                    style={{ width: 140, height: 190, borderRadius: 10 }}
                                    transition={600}
                                />
                                <View style={{ flex: 1, flexShrink: 1, gap: 10, paddingLeft: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: 'white', }}>{item.russian}</Text>
                                    <View style={{ flexDirection: "row", flexShrink: 1, flexWrap: 'wrap' }}>
                                        {item.genres.map((genre, index) => (
                                            <Text key={`genre-${genre.id}-${index}`} style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                                                {genre.russian}{index < item.genres.length - 1 && (', ')}
                                            </Text>
                                        ))}
                                    </View>
                                    <View style={{ flexDirection: "row", flexShrink: 1, flexWrap: 'wrap', gap: 10 }}>

                                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', padding: 4, paddingHorizontal: 8, backgroundColor: '#423f3fff', borderRadius: 8 }}>
                                            {TranslatedStatus[item.status]}
                                        </Text>

                                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', padding: 4, paddingHorizontal: 8, backgroundColor: '#423f3fff', borderRadius: 8 }}>
                                            {TranslatedKind[item.kind]}
                                        </Text>

                                    </View>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Пусто</Text>
                    </View>
                }
            />

        </>

    )


}