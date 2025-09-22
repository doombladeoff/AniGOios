import { auth } from '@/lib/firebase';
import { addFavoriteAnime, isAnimeInFavorites, removeFavoriteAnime, updateStatusFavoriteAnime } from '@/lib/firebase/userFavorites';
import { addAnimeToFolder, removeAnimeFromFolder } from '@/lib/firebase/userFolders';
import { useAnimeStore } from '@/store/animeStore';
import { useUserStore } from '@/store/userStore';
import { memo, useCallback, useEffect, useState } from 'react';
import { SFSymbols6_0 } from 'sf-symbols-typescript';
import * as Dropdown from 'zeego/dropdown-menu';
import { IconSymbol } from '../ui/IconSymbol';

const statusOptions = [
    { title: 'Просмотренно', icon: 'checkmark.seal.fill', color: 'green', status: 'completed', watched: true },
    { title: 'Смотрю', icon: 'play.tv.fill', color: 'skyblue', status: 'watching', watched: false },
    { title: 'Запланировано', icon: 'calendar', color: 'orange', status: 'planned', watched: false },
    { title: 'Брошено', icon: 'tv.slash.fill', color: 'red', status: 'dropped', watched: false },
    { title: 'Отложено', icon: 'stopwatch.fill', color: 'gray', status: 'on_hold', watched: false },
];

const fetchInFav = async (animeId: string): Promise<boolean> => {
    if (auth.currentUser) {
        const check = await isAnimeInFavorites(auth.currentUser.uid, animeId);
        return check;
    }
    return false;
};

interface BookmarkProps {
    id: string | number;
    isAnons?: boolean;
}
const Bookmark = ({ id, isAnons }: BookmarkProps) => {
    const anime = useAnimeStore(s => s.animeMap[id as number]);
    const user = useUserStore(s => s.user);

    const [inFavorite, setInFavorite] = useState<boolean>(false);

    useEffect(() => {
        fetchInFav(id as string)
            .then((r) => setInFavorite(r));
    }, [id])

    const favoriteOptions = [
        {
            title: 'Добавить в закладки',
            icon: 'bookmark.fill' as SFSymbols6_0,
            color: 'orange',
            action: () => {
                if (!auth.currentUser) return;
                addFavoriteAnime(auth.currentUser.uid, {
                    id: Number(id),
                    title: anime.russian,
                    poster: anime.poster.main2xUrl,
                    status: '',
                    watched: false,
                });
                setInFavorite(true);
            },
        },
    ];

    const renderDropdownItem = (
        title: string,
        icon?: SFSymbols6_0,
        color?: string,
        onSelect?: () => void,
        destructive?: boolean
    ) => (
        <Dropdown.Item key={title} onSelect={onSelect} destructive={destructive}>
            <Dropdown.ItemTitle>{title}</Dropdown.ItemTitle>
            {icon && (
                <Dropdown.ItemIcon
                    ios={{
                        name: icon,
                        pointSize: 16,
                        weight: destructive ? 'bold' : 'semibold',
                        scale: 'medium',
                        hierarchicalColor: { dark: color || 'white', light: color || 'white' },
                    }}
                />
            )}
        </Dropdown.Item>
    );

    const handleFolderToggle = useCallback((folderName: string, inFolder: boolean) => {
        if (!auth.currentUser) return;
        if (inFolder)
            removeAnimeFromFolder(auth.currentUser.uid, folderName, id as string);
        else
            addAnimeToFolder(auth.currentUser.uid, folderName, id as number);
    }, []);

    return (
        <Dropdown.Root>
            {console.log('render bookmark')}
            <Dropdown.Trigger>
                <IconSymbol name={inFavorite ? 'bookmark.fill' : 'bookmark'} color='orange' size={28} />
            </Dropdown.Trigger>
            <Dropdown.Content>
                {favoriteOptions.map(opt => renderDropdownItem(opt.title, opt.icon, opt.color, opt.action))}

                {inFavorite && renderDropdownItem('Удалить из закладок', 'bookmark.slash.fill' as SFSymbols6_0, 'red', () => {
                    auth.currentUser && removeFavoriteAnime(auth.currentUser.uid, id as number);
                    setInFavorite(false);
                })}

                {!isAnons && (
                    <Dropdown.Sub>
                        <Dropdown.SubTrigger key='sub-menu-trigger' disabled={true}>
                            <Dropdown.ItemTitle>Статус</Dropdown.ItemTitle>
                        </Dropdown.SubTrigger>
                        <Dropdown.SubContent>
                            {statusOptions.map(opt =>
                                renderDropdownItem(opt.title, opt.icon as SFSymbols6_0, opt.color, () => {
                                    auth.currentUser && updateStatusFavoriteAnime(auth.currentUser.uid, id as number, opt.status, opt.watched, anime);
                                    setInFavorite(true);
                                })
                            )}
                            {renderDropdownItem('Удалить статус', undefined, undefined, () => {
                                auth.currentUser && updateStatusFavoriteAnime(auth.currentUser.uid, id as number, '', false);
                            }, true)}
                        </Dropdown.SubContent>
                    </Dropdown.Sub>
                )}

                {user && (
                    <Dropdown.Sub>
                        <Dropdown.SubTrigger key='sub-menu-trigger-folder'>
                            <Dropdown.ItemTitle>Добавить в папку</Dropdown.ItemTitle>
                        </Dropdown.SubTrigger>
                        <Dropdown.SubContent>
                            {user.folders.map(folder => {
                                const inFolder = folder.anime.includes(id as number);
                                return renderDropdownItem(folder.name, inFolder ? 'folder.fill' : 'folder' as SFSymbols6_0, folder.color, () => handleFolderToggle(folder.name, inFolder));
                            })}
                        </Dropdown.SubContent>
                    </Dropdown.Sub>
                )}
            </Dropdown.Content>
        </Dropdown.Root>
    )
};

export default memo(Bookmark);