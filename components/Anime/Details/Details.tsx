import { TranslatedKind } from "@/constants/TranslatedStatus"
import { useAnimeStore } from "@/store/animeStore"
import { cleanDescription } from "@/utils/cleanDescription"
import { Modal, Pressable, ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { IconSymbol } from "../../ui/IconSymbol"
import GenresList from "./Genres/GenresList"

const Details = ({ id, opened, handleShow }: { id: string | number, opened: boolean, handleShow: (v: any) => void }) => {
    const animeData = useAnimeStore(s => s.animeMap[id as number]);
    const insets = useSafeAreaInsets();
    return (
        <Modal visible={opened} animationType='slide' presentationStyle='pageSheet' backdropColor={'black'}>
            <Pressable onPress={handleShow} style={{ alignSelf: 'flex-end', padding: 20 }}>
                <IconSymbol name="xmark" size={22} color={'white'} />
            </Pressable>
            <ScrollView style={{ backgroundColor: 'black' }} contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: insets.bottom + 10 }}>
                <View style={{ gap: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }} selectable suppressHighlighting selectionColor={'red'}>{animeData?.russian}</Text>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>{animeData?.name}</Text>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>{animeData?.english}</Text>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>{animeData?.japanese}</Text>
                </View>

                <View style={{ marginTop: 25, gap: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Описание</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>{cleanDescription(animeData?.description || '') || 'Нет описания'}</Text>
                </View>

                <View style={{ marginTop: 25, gap: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Экранное время</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Тип: {TranslatedKind[animeData?.kind]}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Время: {animeData?.duration} минуты</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Эпизодов: {animeData?.episodes}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>Доступно: {animeData?.episodesAired}</Text>
                </View>

                <View style={{ marginTop: 25, gap: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Жанры</Text>
                    <GenresList id={animeData.malId} genres={animeData.genres} genreTextStyle={{ color: 'white', fontSize: 16, fontWeight: '400' }} genreStyle={{ paddingRight: 5 }} disableNavigation />
                </View>
                {/* <CardSt items={animeData?.animeList?.staff?.nodes} /> */}
            </ScrollView>
        </Modal>
    )
}

export default Details;