import { Image } from "expo-image";
import React, { memo } from "react";
import { Dimensions, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { EpisodeBadgeStatus } from "./EpisodeStatusBade";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CARD_WIDTH = screenWidth - 20;
const CARD_HEIGHT = 180;

const EpisodeCard = ({ item, index, watchedStatuses, onPress, updateEpisodeStatus,
    shouldLoad,
    onImageLoad

}: {
    item: any, index: number, watchedStatuses: any, onPress: () => void, updateEpisodeStatus: (index: number, status: number) => void,
    shouldLoad: boolean,
    onImageLoad: () => void
}) => {
    return (

        <Pressable onPress={onPress}>
            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0 }]}>
                <View>
                    <EpisodeBadgeStatus episodeNumber={index + 1} status={watchedStatuses} />
                    {/* <Text
                        numberOfLines={2}
                        style={{
                            flex: 1,
                            color: 'white',
                            position: 'absolute',
                            zIndex: 10,
                            left: 10,
                            top: 35,
                            fontSize: 14,
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0,0,0,0.8)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 4,
                            height: 80,
                            maxWidth: screenWidth - 70,
                        }}
                    >
                        {item?.title}
                    </Text> */}
                    <Image
                        source={{ uri: item?.thumbnail || item }}
                        onError={(e) => console.warn('err', e)}
                        style={{ width: CARD_WIDTH, height: CARD_HEIGHT + 20, borderRadius: 12, backgroundColor: 'rgba(76, 76, 76, 0.5)' }}
                        transition={500}
                        priority={index <= 3 ? 'high' : 'normal'}
                        cachePolicy={'memory'}
                    />
                </View>
            </View>
        </Pressable>
    )
};

export default memo(EpisodeCard);