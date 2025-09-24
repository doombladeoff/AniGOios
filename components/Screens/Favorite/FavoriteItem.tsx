import { useMappingHelper } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import { memo } from "react";
import { Alert, Dimensions, Pressable } from "react-native";
import Animated, { FadeIn, FadeOutDown } from "react-native-reanimated";

import { Status } from "@/components/Anime/Status";
import { ContextMenu } from "@/components/ContextComponent";

const { width, height } = Dimensions.get("screen");
const ITEM_HEIGHT = height / 4.5;

const FavoriteItem = ({ item, onRemove, index }: { item: any; onRemove: () => void; index: number }) => {
    const { getMappingKey } = useMappingHelper();

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOutDown}
            style={{ padding: 3.5 }}>
            <ContextMenu
                triggerItem={
                    <Pressable onPress={() => router.push({ pathname: "/(screens)/(anime)/[id]", params: { id: item.id, status: item.status } })}>
                        <Image
                            key={getMappingKey(item.id, index)}
                            source={{ uri: item.poster }}
                            style={{
                                width: width / 3 - 7,
                                height: ITEM_HEIGHT,
                                borderRadius: 12,
                                backgroundColor: "#1e1e1e",
                            }}
                            transition={600}
                        />
                        <Status id={item.id} status={item.status} showType="poster" textStyle={{
                            borderRadius: 6,
                            top: 4,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            fontSize: 12,
                            fontWeight: "500",
                        }} />
                    </Pressable>
                }
                items={[
                    {
                        title: "Удалить",
                        destructive: true,
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

export default memo(FavoriteItem);
