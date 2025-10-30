import { CreateFolders, FolderList, Level, NoLogIn, Stats } from "@/components//Screens/Profile";
import { AnimeStatusChart } from "@/components/Screens/Profile/Stats/Chart/AnimeStatusChart";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { useBottomHeight } from "@/hooks/useBottomHeight";
import { useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const isDarkMode = useTheme().theme === "dark";
    const insets = useSafeAreaInsets();
    const user = useUserStore((s) => s.user);
    const [isOpenCreateFolder, setIsOpenCreateFolder] = useState(false);
    const [editFolder, setEditFolder] = useState({ edit: false, name: "", color: "" });

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerAnimated = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolation.CLAMP) },
        ],
    }));

    const avatarAnimated = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(scrollY.value, [0, 150], [0, -50], Extrapolation.CLAMP) },
            { scale: interpolate(scrollY.value, [0, 150], [1, 0.7], Extrapolation.CLAMP) },
        ],
    }));

    const profileInfoAnimated = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolation.CLAMP),
    }));

    if (!user) return <NoLogIn />;

    return (
        <ThemedView darkColor="#050509" lightColor="#fafafa" style={{ flex: 1 }}>
            <Animated.View style={[styles.bannerContainer, headerAnimated]}>
                <Image
                    source={user.bannerURL ? { uri: user.bannerURL } : require("@/assets/banners/1.jpg")}
                    style={styles.bannerImage}
                />
                <View style={styles.bannerOverlay} />
            </Animated.View>

            {/* --- Навигация --- */}
            <View style={[styles.topButtons, { top: insets.top }]}>
                <Pressable
                    onPress={null}
                    style={styles.iconButton}
                >
                    <IconSymbol name="bell.badge.fill" size={26} color="white" />
                </Pressable>

                <Pressable
                    onPress={() => router.push("/(screens)/(settings)/settings")}
                    style={styles.iconButton}
                >
                    <IconSymbol name="gearshape.2.fill" size={26} color="white" />
                </Pressable>
            </View>

            {/* --- Аватар и имя --- */}
            <Animated.View style={[styles.avatarContainer, avatarAnimated]}>
                <Image
                    source={{ uri: user.avatarURL || user.photoURL || "https://i.pinimg.com/736x/4d/21/7b/4d217b9d6aebf2f4ef2292f27dcb8c4d.jpg" }}
                    style={styles.avatar}
                />
            </Animated.View>
            {/* --- Фейк статус --- */}
            <Animated.View style={[styles.profileInfo, profileInfoAnimated]}>
                <ThemedText style={styles.nameText}>{user.displayName || "AkiroX"}</ThemedText>
                <ThemedText style={[styles.quote, {
                    color: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
                }]}>“Жизнь — это аниме, в котором ты главный герой.”</ThemedText>
            </Animated.View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: 260,
                    paddingBottom: Platform.Version >= '26.0' ? insets.bottom + 20 : useBottomHeight() + 20,
                }}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior='automatic'
                style={{ zIndex: 0 }}
            >
                <View style={{ marginHorizontal: 16, gap: 20 }}>
                    <Stats userID={user.uid} friends={user.friends?.length ?? 0} />
                    <Level />
                    <AnimeStatusChart userID={user.uid} />
                    <FolderList
                        userId={user.uid}
                        editFolder={setEditFolder}
                        openCreateFolder={setIsOpenCreateFolder}
                    />
                </View>
                <CreateFolders
                    editFolder={{
                        edit: editFolder.edit,
                        oldName: editFolder.name,
                        oldColor: editFolder.color,
                    }}
                    closeEditFolder={(v) => setEditFolder(v)}
                    userId={user.uid}
                    isOpen={isOpenCreateFolder}
                    openCreateFolder={setIsOpenCreateFolder}
                />
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        position: "absolute",
        width: "100%",
        height: 170,
        overflow: "hidden",
        borderRadius: 20,
        zIndex: 2
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    topButtons: {
        position: "absolute",
        right: 14,
        flexDirection: "row",
        gap: 14,
        zIndex: 10,
    },
    iconButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    avatarContainer: {
        position: "absolute",
        alignSelf: "center",
        top: 100,
        borderWidth: 3,
        borderColor: "#ff5fd2",
        shadowColor: "#ff5fd2",
        shadowOpacity: 0.5,
        shadowRadius: 12,
        borderRadius: 80,
        zIndex: 2
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileInfo: {
        position: "absolute",
        top: 240,
        alignSelf: "center",
        alignItems: "center",
    },
    nameText: {
        fontSize: 24,
        fontWeight: "700",
        textShadowColor: "#ff5fd2",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 4,
    },
    quote: {
        fontSize: 13,
        marginTop: 4,
        fontStyle: "italic",
    },
});
