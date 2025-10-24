import { useTheme } from "@/hooks/ThemeContext"
import { useSearchStore } from "@/store/filterStore"
import { BlurView } from "expo-blur"
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect"
import { memo } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useShallow } from "zustand/shallow"
import { IconSymbol } from "../../ui/IconSymbol"

const Input = ({ onOpenFilter }: { onOpenFilter: (v: boolean) => void }) => {
    const isDarkMode = useTheme().theme === 'dark';
    const insets = useSafeAreaInsets();
    const { query, setQuery } = useSearchStore(useShallow(s => ({
        query: s.query,
        setQuery: s.setQuery,
    })));

    const renderInput = (
        <>
            <IconSymbol name="magnifyingglass" size={22} color="#aaa" style={{ marginRight: 8 }} />
            <TextInput
                value={query}
                style={[styles.input, { color: isDarkMode ? 'white' : 'black' }]}
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
        </>
    );

    /* GLASSVIEW EXPEREMENTAL ON IOS 26 */
    return (
        <View style={[styles.container, { top: insets.top + 10 }]}>
            {isLiquidGlassAvailable() ? (
                <GlassView glassEffectStyle="regular" style={styles.blur}>
                    {renderInput}
                </GlassView>
            ) : (
                <BlurView
                    tint={isDarkMode ? 'dark' : 'systemChromeMaterialLight'}
                    intensity={80}
                    style={[styles.blur, { borderWidth: 0.7, borderColor: 'rgba(255,255,255,0.5)' }]}
                >
                    {renderInput}
                </BlurView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 10,
        right: 10,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    blur: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 18,
        height: 54,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255,255,255,0.15)",
        overflow: "hidden",
    },
    input: {
        flex: 1,
        fontSize: 17,
        fontWeight: "500",
        backgroundColor: "transparent",
        paddingVertical: 0,
    },
})

export default memo(Input)