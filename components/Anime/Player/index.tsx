import { VideoPlayer } from '@/components/Anime/Player/VideoPlayer';
import { usePlayer } from "@/hooks/player/usePlayer";
import { storage } from '@/utils/storage';
import { memo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { EpisodePicker } from './EpisodePicker';

interface PlayerStyleProps {
    id: number | string;
}

const Player = ({ id }: PlayerStyleProps) => {
    const {
        videoUrl,
        voiceOvers,
        episodeList,
        toggle,
        fetchVideoUrl,
    } = usePlayer({ animeId: id as string });

    if (!episodeList || !voiceOvers)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'small'} color={'white'} />
            </View>
        );

    const storedVoice = storage.getSavedVoiceOvers(id as string) || null;
    const selectedVoiceOver = voiceOvers[Number(storedVoice) || 0];
    const episodesArray = Object.entries(episodeList).map(([key, value]) => ({
        number: Number(key),
        url: value,
    }));

    const storedEp = storage.getLastViewEpisode(id as string) || 1;
    const [selectedEp, setSelectedep] = useState(storedEp);

    return (
        <View>
            <EpisodePicker
                containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                itemStyle={styles.dropItem}
                episodesArray={episodesArray}
                voiceOvers={voiceOvers}
                selectedEp={Number(selectedEp)}
                selectedVoiceOver={selectedVoiceOver?.title ?? ''}
                onSelectEpisode={(epNumber) => { fetchVideoUrl(String(epNumber)); setSelectedep(epNumber) }}
                onSelectVoiceOver={(voiceOverId) => { toggle(voiceOverId); fetchVideoUrl(String(selectedEp)) }}
            />

            {videoUrl &&
                <VideoPlayer
                    key={selectedEp}
                    videoUrl={videoUrl}
                    style={styles.player}
                    overlayStyle={styles.overlay}
                    episodeNumber={selectedEp}
                    animeId={id}
                />
            }
        </View>
    )
};


const styles = StyleSheet.create({
    dropItem: {
        marginHorizontal: 15,
        backgroundColor: '#1c1c1e',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: 'white',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        gap: 5,
    },
    player: {
        height: 245,
        margin: 5,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'black',
    },
    overlay: {
        width: '100%',
        height: 285,
        justifyContent: 'space-between',
        position: 'absolute',
        zIndex: 1,
        paddingVertical: 10
    }
});

export default memo(Player)
