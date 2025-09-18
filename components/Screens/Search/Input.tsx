import { useSearchStore } from "@/store/filterStore"
import { BlurView } from "expo-blur"
import { memo } from "react"
import { Pressable, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useShallow } from "zustand/shallow"
import { IconSymbol } from "../../ui/IconSymbol"

const Input = ({ onOpenFilter }: { onOpenFilter: (v: boolean) => void }) => {
    console.log('redner input')
    const insets = useSafeAreaInsets();
    const {
        query, setQuery,
    } = useSearchStore(useShallow(s => ({
        query: s.query,
        setQuery: s.setQuery,
    })));

    return (
        <View style={{
            position: "absolute",
            top: insets.top + 10,
            left: 10,
            right: 10,
            zIndex: 9999,
            shadowColor: "#000",
            shadowOpacity: 0.75,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
        }}>
            <BlurView
                tint='systemMaterial'
                intensity={80}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 18,
                    height: 54,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                }}
            >
                <IconSymbol name="magnifyingglass" size={22} color="#aaa" style={{ marginRight: 8 }} />
                <TextInput
                    value={query}
                    style={{
                        flex: 1,
                        // color: "#222",
                        color: 'white',
                        fontSize: 17,
                        fontWeight: "500",
                        backgroundColor: "transparent",
                        paddingVertical: 0,
                    }}
                    placeholder="Поиск аниме"
                    placeholderTextColor="#aaa"
                    onChangeText={setQuery}
                    selectionColor="#007AFF"
                />
                {query.length > 0 && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Pressable onPress={() => setQuery("")} style={{ marginLeft: 8 }}>
                            <IconSymbol name="xmark.circle.fill" size={22} color="#bbb" />
                        </Pressable>
                    </Animated.View>
                )}
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <Pressable onPress={() => onOpenFilter(true)} style={{ marginLeft: 8 }}>
                        <IconSymbol name="slider.horizontal.3" size={22} color="#007AFF" />
                    </Pressable>
                </Animated.View>
            </BlurView>
        </View>
    )
}

export default memo(Input)