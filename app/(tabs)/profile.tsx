import { Comments, CreateFolders, EditProfile, FolderList, Header, Level, NoLogIn, Stats } from "@/components//Screens/Profile";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { db } from "@/lib/firebase";
import { useUserStore } from "@/store/userStore";
import { Comment } from "@/utils/firebase/userComments";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, { Extrapolation, FadeIn, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('screen');
export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const user = useUserStore(s => s.user);
    const [isOpenCreateFolder, setIsOpenCreateFolder] = useState<boolean>(false);
    const [editFolder, setEditFolder] = useState<{ edit: boolean, name: string, color: string }>({
        edit: false,
        name: '',
        color: '',
    });

    const [profileEdit, setProfileEdit] = useState(false);
    const [commentsArr, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!user) return;

        const commentsRef = collection(db, "user-collection", user?.uid, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comments: Comment[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    createdAt: data.createdAt,
                    text: data.text,
                    uid: data.uid,
                    name: data.name,
                    avatar: data.avatar,
                    date: data.date,
                };
            });
            setComments(comments);
        });

        return () => unsubscribe();
    }, [user]);

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const avatarAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.5],
            Extrapolation.CLAMP
        );

        const translateX = interpolate(
            scrollY.value,
            [0, 100],
            [0, -width + 100],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [0, 100],
            [0, -40],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { scale },
                { translateX },
                { translateY },
            ],
        };
    });

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [40, 100], // когда начинать появление и когда полностью видно
            [0, 1],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [40, 100],
            [20, 0], // поднимаем из 20 вниз до 0
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    })

    if (!user) return (<NoLogIn />);

    return (
        <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ shadowColor: 'black', shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
                <Header
                    bannerStyle={{ width: '100%', height: 140, borderRadius: 14, backgroundColor: 'black' }}
                    avatarContainer={[avatarAnimatedStyle, { position: 'absolute', alignSelf: 'center', top: 120 / 1.75, backgroundColor: 'black', padding: 4, borderRadius: 20 }]}
                    avatarStyle={{ width: 100, height: 100, borderRadius: 16, padding: 0, backgroundColor: 'black' }}
                />
                <Animated.Text style={[textStyle, { color: 'white', position: 'absolute', alignSelf: 'center', bottom: 25, fontSize: 21, fontWeight: '600' }]}>{user.displayName}</Animated.Text>
                <Pressable
                    hitSlop={30}
                    onPress={() => { router.push({ pathname: '/(screens)/(settings)/settings' }) }}
                    style={{ position: 'absolute', top: insets.top, right: 10, shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } }}
                >
                    <IconSymbol name="gear" size={24} color={'white'} />
                </Pressable>
            </View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingVertical: 10,
                    paddingBottom: 100
                }}
            >

                <View style={{ marginTop: 40, marginHorizontal: 10 }}>
                    <Stats userID={user.uid} friends={user.friends.length} />
                    <Level />

                    <FolderList
                        editFolder={setEditFolder}
                        userId={user.uid} openCreateFolder={setIsOpenCreateFolder} />
                </View>

                {/* <Pressable
                    onPress={() => setProfileEdit(true)}
                    style={{
                        paddingVertical: 14,
                        borderRadius: 12,
                        backgroundColor: "#0A84FF",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 24,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        Редактировать
                    </Text>
                </Pressable> */}

                <View style={{ marginTop: 15 }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginHorizontal: 10, marginBottom: 10 }}>Комментарии</Text>
                    <Comments comments={commentsArr} userID={user.uid} />
                </View>

                <CreateFolders
                    editFolder={{
                        edit: editFolder.edit,
                        oldName: editFolder.name,
                        oldColor: editFolder.color,
                    }}
                    closeEditFolder={({ edit, name, color }) => setEditFolder({ edit, name: name, color: color })}
                    userId={user.uid}
                    isOpen={isOpenCreateFolder}
                    openCreateFolder={setIsOpenCreateFolder}
                />

                {/* <View style={{ height: 600 }} /> */}
            </Animated.ScrollView>


            <EditProfile show={profileEdit} onClose={setProfileEdit} />
        </Animated.View>
    );
}