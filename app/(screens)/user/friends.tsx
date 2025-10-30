import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { acceptFriendRequest, getFriendsData, rejectFriendRequest, searchUsersByName } from "@/lib/firebase/user-friends";
import { CustomUser, useUserStore } from "@/store/userStore";
import { isLiquidGlassSupported, LiquidGlassView } from "@callstack/liquid-glass";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeInUp, FadeOutLeft, LinearTransition } from "react-native-reanimated";

export default function FriendsScreen() {
    const isDarkMode = useTheme().theme === 'dark';
    const user = useUserStore(s => s.user);
    const [searchText, setSearchText] = useState("");
    const [findPeople, setFindPeople] = useState<CustomUser[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const debounceRef = useRef<number | null>(null);

    const [friend, setFriend] = useState<{
        friends: CustomUser[];
        received: CustomUser[];
        sent: CustomUser[];
    }>({
        friends: [],
        received: [],
        sent: [],
    });

    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = onSnapshot(doc(db, "user-collection", auth.currentUser.uid), async (snap) => {
            if (!snap.exists()) return;
            const data = snap.data();
            const friends = data.friends || [];
            const received = data.friendRequestsReceived || [];
            const sent = data.friendRequestsSent || [];

            const [friendUsers, receivedUsers, sentUsers] = await Promise.all([
                getFriendsData(friends),
                getFriendsData(received),
                getFriendsData(sent),
            ]);

            setFriend({
                friends: friendUsers,
                received: receivedUsers,
                sent: sentUsers,
            });
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        if (!searchText.trim()) {
            setFindPeople([]);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            searchUsersByName(searchText).then(setFindPeople).catch(console.error);
        }, 600);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchText]);

    if (!user) return null;

    const handlePressUser = (u: CustomUser) => {
        setModalVisible(false);
        const isFriend = friend.friends.some(f => f.uid === u.uid);

        router.push({
            pathname: "/(screens)/user/[id]",
            params: { id: u.uid, isFriend: String(isFriend) },
        });
    };

    const ListHeader = () => {
        return (
            <>
                {/* Входящие заявки */}
                {friend.received.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <ThemedText style={styles.sectionTitle}>Заявки в друзья</ThemedText>
                        {friend.received.map((fs, index) => (
                            <Animated.View
                                key={fs.uid}
                                layout={LinearTransition.springify()}
                                entering={FadeInRight.delay(100 * index).duration(300)}
                                exiting={FadeOutLeft}
                            >
                                <Pressable onPress={() => handlePressUser(fs)}>
                                    <LiquidGlassView
                                        style={[
                                            styles.requestCard,
                                            !isLiquidGlassSupported && { backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3" },
                                        ]}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <Image source={{ uri: fs.avatarURL || fs.photoURL || '' }} style={styles.avatar} />
                                            <ThemedText>{fs.displayName}</ThemedText>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <LiquidGlassView interactive style={{ borderRadius: 100 }}>
                                                <Pressable
                                                    style={[styles.actionButton, { backgroundColor: '#0A84FF' }]}
                                                    onPress={() => auth.currentUser && acceptFriendRequest(auth.currentUser.uid, fs.uid)}
                                                >
                                                    <IconSymbol name="checkmark" size={20} color={'white'} />
                                                </Pressable>
                                            </LiquidGlassView>

                                            <LiquidGlassView interactive style={{ borderRadius: 100 }}>
                                                <Pressable
                                                    style={[styles.actionButton, { backgroundColor: 'red' }]}
                                                    onPress={() => auth.currentUser && rejectFriendRequest(auth.currentUser.uid, fs.uid)}
                                                >
                                                    <IconSymbol name="xmark" size={20} color={'white'} />
                                                </Pressable>
                                            </LiquidGlassView>
                                        </View>
                                    </LiquidGlassView>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Исходящие заявки */}
                {friend.sent.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <ThemedText style={styles.sectionTitle}>Исходящие заявки</ThemedText>
                        {friend.sent.map((fs, i) => (
                            <View key={fs.uid}>
                                <UserItem user={fs} onPress={() => handlePressUser(fs)} />
                            </View>
                        ))}
                    </View>
                )}
            </>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    unstable_headerRightItems: () => [
                        {
                            type: 'button',
                            label: 'Add',
                            tintColor: '#0A84FF',
                            icon: {
                                type: 'sfSymbol',
                                name: 'person.crop.circle.badge.plus',
                            },
                            onPress: () => setModalVisible(true),
                        },
                    ],
                }}
            />

            <FlatList
                data={friend.friends}
                keyExtractor={(item) => item.uid.toString()}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <ThemedText style={styles.sectionTitle}>Мои друзья</ThemedText>}
                        <UserItem
                            user={item}
                            onPress={() => handlePressUser(item)}
                        />
                    </>
                )}
                ListHeaderComponent={<ListHeader />}
                ListEmptyComponent={
                    <Animated.View entering={FadeInUp.duration(400)} style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={48} color={isDarkMode ? "#fff" : "#1c1c1e"} />
                        <ThemedText style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginTop: 12,
                            color: isDarkMode ? "#fff" : "#1c1c1e"
                        }}>
                            У вас пока нет друзей
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 14,
                            marginTop: 4,
                            textAlign: "center",
                            color: isDarkMode ? "#fff" : "#1c1c1e"
                        }}>
                            Начните искать друзей и добавлять их!
                        </ThemedText>
                    </Animated.View>
                }
            />

            <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
                <ThemedView darkColor='black' lightColor='white' style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <ThemedText darkColor="white" lightColor="black" style={{ fontSize: 16 }}>Отмена</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.modalTitle}>Найти друзей</ThemedText>
                        <View style={{ width: 30 }} />
                    </View>

                    <View style={[styles.searchBox, {
                        backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    }]}>
                        <TextInput
                            placeholder="Введите имя..."
                            placeholderTextColor="gray"
                            style={[styles.searchInput, {
                                color: isDarkMode ? 'white' : 'black',
                            }]}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        {searchText.length > 0 && (
                            <Pressable onPress={() => setSearchText('')}>
                                <IconSymbol name="xmark" size={16} />
                            </Pressable>
                        )}
                    </View>

                    <FlatList
                        data={findPeople}
                        keyExtractor={(item) => item.uid}
                        renderItem={({ item }) => (
                            <UserItem user={item} onPress={() => handlePressUser(item)} />
                        )}
                        ListEmptyComponent={
                            <ThemedText style={styles.noResults}>Ничего не найдено</ThemedText>
                        }
                    />
                </ThemedView>
            </Modal>
        </>
    );
}

function UserItem({ user, onPress }: { user: CustomUser; onPress?: () => void }) {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <Animated.View entering={FadeInDown.duration(300)}>
            <LiquidGlassView
                interactive
                style={[
                    styles.requestCard,
                    !isLiquidGlassSupported && { backgroundColor: isDarkMode ? "#1c1c1e" : "#f0f0f3" },
                ]}
            >
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => ([styles.userPressable, { opacity: pressed ? 0.8 : 1 }])}>
                    <Image source={{ uri: user.avatarURL || user.photoURL || '' }} style={styles.userAvatar} />
                    <View>
                        <ThemedText style={styles.userName}>{user.displayName}</ThemedText>
                    </View>
                </Pressable>
                <IconSymbol name="chevron.right" size={18} color={isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
            </LiquidGlassView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 8
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    actionButton: {
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 14,
        padding: 10,
        marginVertical: 6,
    },
    userPressable: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    userAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'gray'
    },
    userName: {
        fontSize: 16,
        fontWeight: "600"
    },
    userSubText: {
        fontSize: 13,
        opacity: 0.6
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        fontSize: 18,
        opacity: 0.7
    },
    modalContainer: {
        flex: 1,
        padding: 10
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600"
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16
    },
    noResults: {
        textAlign: "center",
        opacity: 0.5,
        marginTop: 30
    },
});
