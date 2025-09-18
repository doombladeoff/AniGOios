import { Player } from "@/components/Anime/Player";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlayerScreen() {
    const { id } = useLocalSearchParams();
    const { width: SW, height: SH } = useWindowDimensions();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const isWideHorizontal = SW > SH;
    return (
        <>
            <Stack.Screen options={{ headerShown: isWideHorizontal ? true : true, headerTransparent: true }} />
            <View style={{ top: headerHeight }}>
                <Player id={id as string}
                    playerStyle={{ width: SW, height: isWideHorizontal ? SH : SH / 1.25, position: 'absolute' }}
                    selectionStyle={{
                        zIndex: 2, position: 'absolute', flexDirection: 'row', paddingHorizontal: insets.left / 4,
                        paddingVertical: 0,
                    }}
                    overlayStyle={{
                        paddingHorizontal: insets.left / 4,
                        paddingVertical: insets.bottom,
                        position: 'absolute', width: SW, height: isWideHorizontal ? SH : SH / 1.25, zIndex: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column'
                    }}
                    useWide={true}
                />
            </View>

        </>
    )
}