import { GradientBlur } from "@/components/GradientBlur";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { ContentUnavailableView, Host } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { FlashList } from "@shopify/flash-list";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

const GRADIENT_DARK_COLOR = ["black", "rgba(0,0,0,0.5)", "rgba(0,0,0,0)"] as const;
const GRADIENT_LIGHT_COLOR = ["white", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"] as const;

type SearchFavoriteProps = {
    searchMode: boolean;
    closeSearch: (v: boolean) => void;
    renderItem: any;
};

export type SearchFavoriteHandle = {
    blur: () => void;
    focus: () => void;
};


const SearchFavorite = forwardRef<SearchFavoriteHandle, SearchFavoriteProps>(
    ({ searchMode, closeSearch, renderItem }, ref) => {
        const { theme } = useTheme();
        const isDarkMode = theme === "dark";

        const [searchText, setSearchText] = useState('');
        const [searchRes, setSearchRes] = useState<any[]>([]);

        const insets = useSafeAreaInsets();

        const inputRef = useRef<TextInput>(null);
        useImperativeHandle(ref, () => ({
            blur: () => inputRef.current?.blur(),
            focus: () => inputRef.current?.focus(),
        }));

        const { colors, locations } = easeGradient({
            colorStops: {
                0: { color: "black" },
                0.5: { color: "rgba(0,0,0,0.9)" },
                1: { color: "transparent" },
            },
        });

        useEffect(() => {
            const fetchSearch = async () => {
                if (!auth.currentUser) return;
                const queryText = searchText.trim();
                if (!queryText) {
                    setSearchRes([]);
                    return;
                }

                try {
                    const favoritesRef = collection(db, "user-favorites", auth.currentUser.uid, "favorites");
                    const q = query(
                        favoritesRef,
                        where("title", ">=", queryText),
                        where("title", "<=", queryText + "\uf8ff")
                    );
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSearchRes(data);
                } catch (e) {
                    console.error("Ошибка при поиске:", e);
                }
            };

            fetchSearch();
        }, [searchText]);

        const renderSearchBar = () => (
            <View style={styles.searchBarContainer}>
                <GlassView glassEffectStyle="regular" style={styles.searchInputGlass}>
                    <TextInput
                        ref={inputRef}
                        placeholder="Поиск"
                        value={searchText}
                        onChangeText={setSearchText}
                        style={[styles.textInput, { color: isDarkMode ? "white" : "black" }]}
                    />
                    {searchText.length > 0 && (
                        <Pressable
                            hitSlop={20}
                            onPress={() => setSearchText('')}
                            style={styles.clearButton}
                        >
                            <IconSymbol name="xmark" size={10} />
                        </Pressable>
                    )}
                </GlassView>
                <GlassView isInteractive style={styles.closeButtonGlass}>
                    <Pressable onPress={() => closeSearch(false)}>
                        <IconSymbol name="xmark" size={24} style={{ width: 25, height: 25 }} />
                    </Pressable>
                </GlassView>
            </View>
        );

        return (
            <Modal
                visible={searchMode}
                animationType="slide"
                presentationStyle="formSheet"
                backdropColor={isDarkMode ? "black" : "white"}
            >
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                    <GradientBlur
                        colors={colors}
                        locations={locations}
                        containerStyle={{ position: "absolute", top: 0, zIndex: 1, width, height: insets.top * 1.8 }}
                        tint="light"
                        blurIntensity={20}
                    />

                    <LinearGradient
                        colors={isDarkMode ? GRADIENT_DARK_COLOR : GRADIENT_LIGHT_COLOR}
                        style={[StyleSheet.absoluteFill, { height: insets.top * 2.35, zIndex: 2 }]}
                        pointerEvents="none"
                    />

                    <View style={{ paddingHorizontal: 20 }}>{renderSearchBar()}</View>

                    {searchRes.length === 0 ? (
                        <Host style={{ flex: 1 }}>
                            <ContentUnavailableView
                                systemImage="icloud.slash.fill"
                                title="Ничего не найдено"
                                description=""
                                modifiers={[foregroundStyle(isDarkMode ? "white" : "black")]}
                            />
                        </Host>
                    ) : (
                        <FlashList
                            data={searchRes}
                            numColumns={3}
                            contentInsetAdjustmentBehavior="automatic"
                            contentContainerStyle={{ paddingTop: 100 }}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                        />
                    )}
                </View>
            </Modal>
        );
    }
);

const styles = StyleSheet.create({
    searchBarContainer: {
        position: "absolute",
        alignSelf: "center",
        top: 30,
        width: "100%",
        zIndex: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
    },
    searchInputGlass: {
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "rgba(90,90,90,0.5)",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textInput: {
        width: "100%",
        height: 50,
        flex: 1,
    },
    clearButton: {
        backgroundColor: "gray",
        padding: 6,
        borderRadius: 100,
    },
    closeButtonGlass: {
        backgroundColor: isLiquidGlassAvailable() ? "rgba(90,90,90,0.5)" : undefined,
        padding: 10,
        borderRadius: 100,
    },
});

export default SearchFavorite;
