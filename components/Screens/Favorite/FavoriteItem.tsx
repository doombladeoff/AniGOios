import { useMappingHelper } from "@shopify/flash-list";
import { Image } from "expo-image";
import { memo } from "react";
import { Alert, Dimensions, Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOutDown } from "react-native-reanimated";

import { Status } from "@/components/Anime/Status";
import { ContextMenu } from "@/components/ContextComponent";

const { width, height } = Dimensions.get("screen");
const ITEM_HEIGHT = height / 4.5;

const FavoriteItem = ({ item, onRemove, index, handleNavigate, inSearch }: { item: any; onRemove: () => void; index: number, handleNavigate: () => void, inSearch: boolean }) => {
    const { getMappingKey } = useMappingHelper();
    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOutDown}
            style={{ padding: 3.5 }}>
            <ContextMenu
                triggerItem={
                    <Pressable
                        onLongPress={() => { }}
                        onPress={handleNavigate}>
                        <Image
                            key={getMappingKey(item.id, index)}
                            source={{ uri: item.poster }}
                            style={{
                                width: width / 3 - (inSearch ? 10 : 7),
                                height: ITEM_HEIGHT,
                                borderRadius: 12,
                                backgroundColor: "#5a5a5aff",
                            }}
                            transition={600}
                        />
                        <Status
                            id={item.id}
                            status={item.status}
                            showType="poster"
                            textStyle={styles.statusText}
                            containerStyle={styles.statusContainer}
                        />
                    </Pressable>
                }
                previewItem={
                    <Image
                        key={getMappingKey(item.id, index)}
                        source={{ uri: item.poster }}
                        style={{
                            width: width / 1.55,
                            height: ITEM_HEIGHT * 2,
                            borderRadius: 12,
                            backgroundColor: "#5a5a5aff",
                            padding: 10
                        }}
                        transition={600}
                        contentFit="cover"
                    />
                }
                items={[
                    {
                        title: "Удалить",
                        destructive: true,
                        iconName: 'xmark',
                        iconColor: 'red',
                        onSelect: () =>
                            Alert.alert("Удалить из избранного?", "", [
                                { text: "Отмена" },
                                { text: "Да", style: "destructive", onPress: () => onRemove() },
                            ]),
                    },
                ]}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    statusContainer: {
        top: 4,
        zIndex: 200,
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    statusText: {
        borderRadius: 6,
        top: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        fontWeight: "500",
    }
})

export default memo(FavoriteItem);
