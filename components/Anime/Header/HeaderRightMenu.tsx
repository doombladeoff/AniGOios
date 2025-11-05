import { AnimeStatusEnum } from '@/API/Shikimori/Shikimori.types';
import { auth } from '@/lib/firebase';
import { updateStatusFavoriteAnime } from '@/lib/firebase/userFavorites';
import { addAnimeToFolder, removeAnimeFromFolder } from '@/lib/firebase/userFolders';
import { useAnimeStore } from '@/store/animeStore';
import { useUserStore } from '@/store/userStore';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { SFSymbols6_0 } from 'sf-symbols-typescript';
import * as Dropdown from 'zeego/dropdown-menu';
import { IconSymbol } from '../../ui/IconSymbol';

const STATUS_OPTIONS = [
    { title: 'Просмотрено', icon: 'checkmark.seal.fill', color: 'green', status: 'completed', watched: true },
    { title: 'Смотрю', icon: 'play.tv.fill', color: 'skyblue', status: 'watching', watched: false },
    { title: 'Запланировано', icon: 'calendar', color: 'orange', status: 'planned', watched: false },
    { title: 'Брошено', icon: 'tv.slash.fill', color: 'red', status: 'dropped', watched: false },
    { title: 'Отложено', icon: 'stopwatch.fill', color: 'gray', status: 'on_hold', watched: false },
] as const;

interface HeaderRightProps {
    id: string | number;
}

const HeaderRightMenu = ({ id }: HeaderRightProps) => {
    const anime = useAnimeStore((s) => s.animeMap[id as number]);
    const user = useUserStore((s) => s.user);
    const isAnons = anime?.status === AnimeStatusEnum.anons;

    const handleFolderToggle = useCallback((folderName: string, inFolder: boolean) => {
        if (!auth.currentUser) return;
        if (inFolder)
            removeAnimeFromFolder(auth.currentUser.uid, folderName, id as string);
        else
            addAnimeToFolder(auth.currentUser.uid, folderName, id as number);
    }, [id]);

    const renderItem = useCallback(
        ({ title, subtitle, icon, color, onSelect, destructive }: {
            title: string;
            subtitle?: string;
            icon?: SFSymbols6_0;
            color?: string;
            onSelect?: () => void;
            destructive?: boolean;
        }) => (
            <Dropdown.Item key={title} onSelect={onSelect} destructive={destructive}>
                <Dropdown.ItemTitle>{title}</Dropdown.ItemTitle>
                {subtitle && <Dropdown.ItemSubtitle>{subtitle}</Dropdown.ItemSubtitle>}
                {icon && (
                    <Dropdown.ItemIcon
                        ios={{
                            name: icon,
                            pointSize: 16,
                            weight: destructive ? 'bold' : 'semibold',
                            scale: 'medium',
                            hierarchicalColor: {
                                dark: color || 'white',
                                light: color || 'black',
                            },
                        }}
                    />
                )}
            </Dropdown.Item>
        ),
        []
    );

    return (
        <View>
            <Dropdown.Root>
                <Dropdown.Trigger>
                    <IconSymbol name="ellipsis" size={26} />
                </Dropdown.Trigger>

                <Dropdown.Content>
                    {auth.currentUser && !isAnons && (
                        <Dropdown.Sub>
                            <Dropdown.SubTrigger key='sub-status'>
                                <Dropdown.ItemTitle>Статус</Dropdown.ItemTitle>
                                <Dropdown.ItemIcon
                                    ios={{
                                        name: 'tv',
                                        weight: 'semibold',
                                        scale: 'medium',
                                        hierarchicalColor: { dark: 'white', light: 'black' },
                                    }}
                                />
                            </Dropdown.SubTrigger>

                            <Dropdown.SubContent>
                                {STATUS_OPTIONS.map((opt) =>
                                    renderItem({
                                        title: opt.title,
                                        icon: opt.icon,
                                        color: opt.color,
                                        onSelect: () =>
                                            auth.currentUser &&
                                            updateStatusFavoriteAnime(
                                                auth.currentUser.uid,
                                                id as number,
                                                opt.status,
                                                opt.watched,
                                                anime
                                            ),
                                    })
                                )}
                                {renderItem({
                                    title: 'Удалить статус',
                                    onSelect: () =>
                                        auth.currentUser &&
                                        updateStatusFavoriteAnime(auth.currentUser.uid, id as number, '', false),
                                    destructive: true,
                                })}
                            </Dropdown.SubContent>
                        </Dropdown.Sub>
                    )}

                    {user && user?.folders?.length > 0 && (
                        <>
                            <Dropdown.Separator />
                            <Dropdown.Sub>
                                <Dropdown.SubTrigger key='sub-folder-list'>
                                    <Dropdown.ItemTitle>Добавить в папку</Dropdown.ItemTitle>
                                    <Dropdown.ItemIcon
                                        ios={{
                                            name: 'folder.fill.badge.plus',
                                            weight: 'semibold',
                                            scale: 'medium',
                                            hierarchicalColor: { dark: 'white', light: 'black' },
                                        }}
                                    />
                                </Dropdown.SubTrigger>
                                <Dropdown.SubContent>
                                    {user.folders.map((folder) => {
                                        const inFolder = folder.anime.includes(id as number);
                                        return renderItem({
                                            title: folder.name,
                                            icon: inFolder ? 'folder.fill' : 'folder',
                                            onSelect: () => handleFolderToggle(folder.name, inFolder),
                                        });
                                    })}
                                </Dropdown.SubContent>
                            </Dropdown.Sub>
                        </>
                    )}
                    <Dropdown.Group>
                        <Dropdown.Separator />
                        {renderItem({
                            title: 'Больше информации',
                            icon: 'info.circle.fill',
                            onSelect: () => router.push({ pathname: '/anime/details', params: { id } }),
                        })}
                        {renderItem({
                            title: 'Комментарии',
                            icon: 'bubble.left.and.text.bubble.right.fill',
                            onSelect: () => router.push({ pathname: '/(screens)/comments', params: { id } }),
                        })}

                        {/* === Постер === */}
                        {anime && (
                            <>
                                <Dropdown.Separator />
                                {renderItem({
                                    title: 'Выбрать стиль постера',
                                    icon: 'pencil.and.scribble',
                                    onSelect: () =>
                                        router.push({
                                            pathname: '/(screens)/settings/posterEditor',
                                            params: {
                                                src: JSON.stringify({
                                                    crunch: anime.crunchyroll?.crunchyImages?.tallThumbnail || '',
                                                    def: anime?.poster?.originalUrl,
                                                }),
                                            },
                                        }),
                                })}
                            </>
                        )}
                    </Dropdown.Group>
                </Dropdown.Content>
            </Dropdown.Root>
        </View>
    );
};

export default memo(HeaderRightMenu);
