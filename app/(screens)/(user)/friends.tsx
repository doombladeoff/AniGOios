import { IconSymbol } from "@/components/ui/IconSymbol";
import { db } from "@/lib/firebase";
import { CustomUser, useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { collection, doc, endAt, getDoc, getDocs, orderBy, query, startAt } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";


async function searchUsersByName(searchText: string, limitCount = 10): Promise<CustomUser[]> {
    if (!searchText.trim()) return [];

    const usersRef = collection(db, "user-collection");
    const q = query(
        usersRef,
        orderBy("displayName"),
        startAt(searchText),
        endAt(searchText + "\uf8ff")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as CustomUser)
    })).slice(0, limitCount);
}


type Props = {
    user: CustomUser;
    variant?: "search" | "friend"; // где показывается (поиск или друзья)
    onAdd?: (user: CustomUser) => Promise<void>;
    onRemove?: (user: CustomUser) => Promise<void>;
    onPressItem?: (v: boolean) => void;
};

function UserItem({ user, variant = "search", onAdd, onRemove, onPressItem }: Props) {
    const [status, setStatus] = useState<"idle" | "loading" | "pending">("idle");

    const handlePress = async () => {
        if (status === "loading") return;

        if (variant === "search") {
            setStatus("loading");
            try {
                await onAdd?.(user);
                setStatus("pending"); // после добавления меняем на "Ожидание"
            } catch (e) {
                setStatus("idle");
            }
        } else if (variant === "friend") {
            setStatus("loading");
            try {
                await onRemove?.(user);
                setStatus("idle"); // после удаления кнопка снова "Добавить"
            } catch (e) {
                setStatus("idle");
            }
        }
    };

    const renderButton = () => {
        if (status === "loading") {
            return <ActivityIndicator size="small" color="white" />;
        }

        if (variant === "search") {
            if (status === "pending") {
                return (
                    <IconSymbol name="person.crop.circle.badge.clock.fill" size={26} color={"white"} />
                );
            }
            return (
                <IconSymbol name="plus.app.fill" size={26} color={"white"} />
            );
        }

        if (variant === "friend") {
            return (
                <IconSymbol name="trash.fill" size={22} color={"#FF453A"} />
            );
        }
    };

    return (
        <Animated.View style={styles.userItem} entering={FadeInDown}>
            <Pressable onPress={async () => { onPressItem && await onPressItem(false); router.push({ pathname: '/(screens)/(user)/[id]', params: { id: user.uid } }) }} style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                    source={{ uri: user.avatarURL || "https://via.placeholder.com/40" }}
                    style={styles.userAvatar}
                    transition={500}
                />
                <Text style={styles.userName}>{user.displayName}</Text>
            </Pressable>
            <Pressable hitSlop={20} onPress={handlePress}>
                {renderButton()}
            </Pressable>
        </Animated.View>
    );
};


export default function FriendsScreen() {
    const user = useUserStore(s => s.user);
    const [searchText, setSearchText] = useState("");
    const [findPeople, setFindPeople] = useState<CustomUser[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [isFriend, setIsFreind] = useState<boolean>(false);
    const [isFriendRequested, setIsFriendRequested] = useState<boolean>(false);

    const debounceRef = useRef<number | null>(null);

    // Дебаунс поиска
    useEffect(() => {
        if (!searchText.trim()) {
            setFindPeople([]);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            searchUsersByName(searchText).then(setFindPeople).catch(console.error);
        }, 1000);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchText]);


    useEffect(() => {
        const checkFriendsRequest = async () => {
            if (!user?.uid) return [];
            const getIncomingRequests = async () => {
                const snap = await getDoc(doc(db, "user-collection", user.uid));
                const friendRequestsReceived = snap.data()?.friendRequestsSent || [];
                console.log(snap.data()?.friendRequestsSent)
                // return friendRequestsReceived.includes(id);
                return false;
            };

            const requested = await getIncomingRequests();
            setIsFriendRequested(requested);
            if (!requested) {
                const snap = await getDoc(doc(db, "user-collection", user.uid));
                const friends = snap.data()?.friends || [];
                // if (friends.includes(id))
                //     setIsFreind(true);
            }
        }
        checkFriendsRequest();
    }, [user?.uid]);

    if (!user) return null;

    if (user.friends.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>У вас пока нет друзей</Text>
                <Pressable style={styles.findButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.findButtonText}>Найти друзей</Text>
                </Pressable>

                <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" backdropColor={'black'}>
                    <StatusBar barStyle="dark-content" />
                    <View style={styles.modalHeader}>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={styles.backText}>Назад</Text>
                        </Pressable>
                        <Text style={styles.modalTitle}>Найти друзей</Text>
                        <View style={{ width: 50 }} />
                    </View>

                    <TextInput
                        placeholder="Введите имя..."
                        placeholderTextColor="gray"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                    <FlatList
                        data={findPeople}
                        keyExtractor={(item) => item.uid}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        renderItem={({ item }) => (
                            <UserItem
                                user={item}
                                variant="search"
                                onPressItem={setModalVisible}
                                onAdd={async (user) => {
                                    console.log("Добавить:", user.displayName);
                                    await new Promise(r => setTimeout(r, 1500)); // имитация сети
                                }}
                            />
                        )}
                        ListEmptyComponent={
                            <Text style={styles.noResults}>Ничего не найдено</Text>
                        }
                    />
                </Modal>
            </View>
        );
    }

    return (
        <FlatList
            data={user.friends}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.friendsList}
            renderItem={({ item }) => (
                <View style={styles.friendItem}>
                    <Image
                        source={{ uri: item.avatarURL || 'https://via.placeholder.com/40' }}
                        style={styles.userAvatar}
                        transition={500}
                    />
                    <Text style={styles.friendName}>{item.name}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    emptyText: { color: "white", fontSize: 18, marginBottom: 20 },
    findButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#0A84FF", borderRadius: 12 },
    findButtonText: { color: "white", fontWeight: "600", fontSize: 16 },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
        // backgroundColor: "#f9f9f9"
    },
    backText: { color: "#0A84FF", fontSize: 16 },
    modalTitle: { fontSize: 20, fontWeight: "600" },

    modalContainer: {
        flex: 1,
        backgroundColor: "#1c1c1e",
        padding: 20
    },
    searchInput: {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 16,
        color: "white",
        fontSize: 16,
        marginBottom: 20,
        marginHorizontal: 10,
    },

    userItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)"
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    userName: {
        color: "white",
        fontSize: 16
    },

    noResults: {
        color: "gray",
        textAlign: "center",
        marginTop: 20
    },

    friendsList: {
        padding: 16
    },
    friendItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)"
    },
    friendName: {
        color: "white",
        fontSize: 16
    },
});
