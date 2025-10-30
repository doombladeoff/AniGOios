import { DynamicStatusBar } from "@/components/DynamicStatusBar";
import { Level, Stats } from "@/components/Screens/Profile";
import { AnimeStatusChart } from "@/components/Screens/Profile/Stats/Chart/AnimeStatusChart";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { db } from "@/lib/firebase";
import { deleteFriend, sendFriendRequest } from "@/lib/firebase/user-friends";
import { CustomUser, useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Animated, { Extrapolation, FadeIn, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type User = {
    id: any
} & CustomUser;

export default function ProfileScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const { id: userID, isFriend: boolIsFriend } = useLocalSearchParams<{ id: string, isFriend: string }>();
    const [isFriendCheck, setIsFriendCheck] = useState<boolean>(boolIsFriend && boolIsFriend === 'true' || false);
    const [isFriendPending, setIsFriendPending] = useState<boolean>(false);

    const authUser = useUserStore(s => s.user);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        const userRef = doc(db, "user-collection", String(userID));
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data() as CustomUser;
            setUser({ id: userSnap.id, ...userData });
            setLoading(false);
            if (userData.friendRequestsReceived?.includes(authUser?.uid || '')) {
                console.log("Пользователь есть в списке запросов в друзья");
                setIsFriendPending(true);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
        setLoading(false);
    };

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
            { translateY: interpolate(scrollY.value, [-40, 40], [0, -60], Extrapolation.CLAMP) },
            { scale: interpolate(scrollY.value, [-40, 40], [1, 0.7], Extrapolation.CLAMP) },
        ],
    }));

    const profileInfoAnimated = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolation.CLAMP),
    }))

    useEffect(() => { fetchUser(); }, [userID]);

    const handleSentRequest = () => {
        if (authUser) {
            sendFriendRequest(authUser?.uid, userID.toString());
            setIsFriendPending(true);
        }
    }
    const handleDeleteFriend = () => {
        authUser &&
            Alert.alert(
                "Удалить из друзей",
                `Вы уверены что хотите удалить ${user?.displayName} из друзей?`,
                [
                    { text: 'Отмена', style: 'cancel' },
                    {
                        text: 'Удалить', style: 'destructive', onPress: () => {
                            deleteFriend(authUser?.uid, userID);
                            setIsFriendCheck(false)
                        }
                    }
                ]
            );
    };

    if (loading) {
        return (
            <ThemedView darkColor="black" lightColor="white" style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator size={'small'} />
            </ThemedView>
        );
    };

    if ((!user && !loading) || !user) return null;

    return (
        <>
            <DynamicStatusBar uri={user?.bannerURL || require('@/assets/banners/1.jpg')} />
            <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
                <ThemedView darkColor="black" lightColor="white" style={{ flex: 1 }}>
                    <Stack.Screen
                        options={{
                            ...(authUser?.uid !== userID && {
                                unstable_headerRightItems: () => [
                                    {
                                        type: 'button',
                                        label: 'Add',
                                        tintColor: isFriendCheck ? 'red' : 'white',
                                        icon: {
                                            type: 'sfSymbol',
                                            name: isFriendCheck ? 'person.crop.circle.fill.badge.minus' :
                                                isFriendPending ? 'person.crop.circle.badge.clock' : 'plus'
                                        },
                                        onPress: () => {
                                            isFriendCheck ? handleDeleteFriend() :
                                                isFriendPending ? null : handleSentRequest();
                                        },
                                    },
                                ]
                            }),
                        }}
                    />
                    <Animated.View style={[styles.bannerContainer, headerAnimated]}>
                        <Image
                            source={user.bannerURL ? { uri: user.bannerURL } : require("@/assets/banners/1.jpg")}
                            style={styles.bannerImage}
                        />
                        <View style={styles.bannerOverlay} />
                    </Animated.View>

                    <Animated.View style={[styles.avatarContainer, avatarAnimated]}>
                        <Image
                            source={{ uri: user.avatarURL || user.photoURL || "https://i.pinimg.com/736x/4d/21/7b/4d217b9d6aebf2f4ef2292f27dcb8c4d.jpg" }}
                            style={styles.avatar}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.profileInfo, profileInfoAnimated]}>
                        <ThemedText style={styles.nameText}>{user.displayName}</ThemedText>
                    </Animated.View>

                    <Animated.ScrollView
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingTop: 180,
                        }}
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior='automatic'
                        style={{ zIndex: 0 }}
                    >
                        <View style={{ marginHorizontal: 16, gap: 20 }}>
                            <Stats userID={user.uid} friends={user.friends?.length ?? 0} />
                            <Level />
                            <AnimeStatusChart userID={user.uid} />
                        </View>
                    </Animated.ScrollView>
                </ThemedView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        position: "absolute",
        width: "100%",
        height: 170,
        overflow: "hidden",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
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
        backgroundColor: 'gray'
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