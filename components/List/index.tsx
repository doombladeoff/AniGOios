import { ShikimoriAnime } from "@/API/Shikimori/Shikimori.types"
import { useBottomHeight } from "@/hooks/useBottomHeight"
import { useHeaderHeight } from "@react-navigation/elements"
import { FlashList, FlashListProps } from "@shopify/flash-list"
import { ImageStyle } from "expo-image"
import { router } from "expo-router"
import { memo, useCallback, useMemo } from "react"
import { Dimensions, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import Animated, { FadeInLeft } from "react-native-reanimated"
import { SFSymbols6_0 } from "sf-symbols-typescript"
import { ContextMenu } from "../ContextComponent"
import { CardPoster } from "./Item/CardPoster"
import { Preview } from "./Item/Preview"
import ScoreBadge from "./Item/ScoreBadge"
import { ListHeader } from "./ListHeader"

interface ShikimoriAnimeB extends ShikimoriAnime {
    bannerImage: string;
}

interface ListProps extends Omit<FlashListProps<ShikimoriAnimeB>, 'renderItem'> {
    data: ShikimoriAnimeB[];
    headerText: string;
    textStyle?: StyleProp<TextStyle>;
    horizontal?: boolean;
    numColumns?: number;
    showHeader?: boolean;
    typeRequest: 'top_rated' | 'on_screens' | 'movie' | 'anons';
    useContextMenu?: boolean;
    imageContainer?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const { width, height } = Dimensions.get('screen');

const imgWidth = (width / 3) - 10;
const imgHeight = height / 4.75;

function List({
    data,
    headerText,
    horizontal = true,
    numColumns = 3,
    showHeader = true,
    typeRequest,
    useContextMenu = false,
    textStyle,
    imageContainer,
    imageStyle,
    ...rest
}: ListProps) {
    console.log('render list', headerText)
    const headerHeight = useHeaderHeight();
    const bottomTabHeight = useBottomHeight();

    const anonsCard = typeRequest === 'anons';

    const handleNavigate = useCallback((id: number) => {
        router.push({ pathname: '/(screens)/(anime)/[id]', params: { id } });
    }, []);

    const contextMenuItems = useMemo(() => (id: number) => [
        {
            title: 'Смотреть',
            iconColor: 'white',
            iconName: 'play.fill' as SFSymbols6_0,
            onSelect: () => handleNavigate(id),
        }
    ], [handleNavigate]);

    const renderItem = ({ item, index }: { item: ShikimoriAnimeB; index: number }) => {
        const handlePress = () => handleNavigate(item.malId);
        return !useContextMenu ? (
            <CardPoster
                index={index}
                img={item.poster?.mainUrl}
                imgStyle={[
                    imageStyle,
                    !horizontal && {
                        width: imgWidth,
                        height: imgHeight,
                        borderRadius: 10,
                        backgroundColor: "#1e1e1e",
                    }
                ]}
                transition={700}
                imgFit='cover'
                imgCachePolicy={'disk'}
                imgPriority={(anonsCard && horizontal) ? 'low' : 'high'}
                container={[
                    styles.container,
                    imageContainer,
                    !horizontal && { padding: 5 },
                ]}
                onPress={handlePress}
            >
                <ScoreBadge
                    score={item.score}
                    anons={anonsCard}
                    containerStyle={[styles.scoreContainer, !horizontal && {
                        left: 8, top: 10
                    }]}
                    textStyle={styles.scoreText}
                    horizontal={horizontal}
                />
            </CardPoster>
        ) : (
            <Animated.View entering={index < 4 ? FadeInLeft.delay(100 * (index)).duration(750) : undefined}>
                <ContextMenu
                    triggerItem={
                        <CardPoster
                            index={index}
                            img={item.poster?.main2xUrl}
                            imgStyle={[imageStyle, { backgroundColor: "#1e1e1e", }]}
                            transition={700}
                            imgFit='cover'
                            imgCachePolicy={'disk'}
                            imgPriority={(anonsCard && horizontal) ? 'low' : 'high'}
                            container={[
                                styles.container,
                                imageContainer,
                            ]}
                            onPress={handlePress}
                        >
                            <ScoreBadge
                                score={item.score}
                                anons={anonsCard}
                                containerStyle={styles.scoreContainer}
                                textStyle={styles.scoreText}
                                horizontal={horizontal}
                            />
                        </CardPoster>
                    }
                    previewItem={
                        <View style={{ minWidth: width, maxWidth: width }}>
                            <Preview
                                bannerImg={item.bannerImage}
                                img={item.poster.originalUrl}
                                width={width}
                                title={item.russian}
                                score={item.score}
                                isAnons={typeRequest === 'anons'}
                                description={item.description}
                            />
                        </View>
                    }
                    items={contextMenuItems(item.malId)}
                />
            </Animated.View>
        )
    };

    return (
        <View style={{ paddingTop: horizontal ? 10 : 0, flex: 1 }}>
            {showHeader &&
                <ListHeader
                    text={headerText}
                    textStyle={textStyle}
                    iconName="arrow.right"
                    iconSize={22}
                    containerStyle={styles.headerStyle}
                    onPress={() => router.push({ pathname: '/(tabs)/(home)/animelist', params: { typeRequest: typeRequest, headerText: headerText } })}
                />
            }

            <FlashList
                horizontal={horizontal}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={horizontal ? 1 : numColumns ? numColumns : 3}
                keyExtractor={(item) => `${item.malId}-anime`}
                data={data}
                contentContainerStyle={{
                    paddingLeft: horizontal ? 10 : 0,
                    paddingHorizontal: horizontal ? 5 : 0,
                    paddingTop: horizontal ? 15 : headerHeight + 5,
                    paddingBottom: horizontal ? 15 : bottomTabHeight,
                }}
                contentInsetAdjustmentBehavior="automatic"
                maxItemsInRecyclePool={15}
                renderItem={renderItem}
                {...rest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerStyle: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        marginRight: 5,
        shadowColor: 'black',
        shadowOpacity: 0.45,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    scoreContainer: {
        position: 'absolute',
        zIndex: 2,
        minWidth: 35,
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 3.5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.65,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 4
    },
    scoreText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
});

export default memo(List);