import { db } from "@/lib/firebase";
import { router } from "expo-router";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = (width / 3) - 15;

async function getCount(uid: string, status?: string) {
    const collRef = collection(db, `user-favorites/${uid}/favorites`);
    if (status) {
        const q = query(collRef, where("status", "==", status));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } else {
        const snapshot = await getCountFromServer(collRef);
        return snapshot.data().count;
    }
}

export const Stats = ({ userID, friends = 0 }: { userID: string, friends?: number }) => {
    const [animeCount, setAnimeCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const fetch = async () => {
        const [animCount, complCount] = await Promise.all([getCount(userID), getCount(userID, 'completed')]);
        setAnimeCount(animCount);
        setCompletedCount(complCount);
    }

    useEffect(() => {
        if (userID) {
            fetch()
        }
    }, [userID]);

    if (!userID) return null;

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                gap: 10,
            }}
        >
            <View
                style={{
                    minWidth: ITEM_WIDTH,
                    alignItems: 'center',
                    backgroundColor: '#1c1c1e',
                    paddingVertical: 12,
                    borderRadius: 10,
                    gap: 6,
                }}
            >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                    {animeCount}
                </Text>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                    Просмотрено
                </Text>
            </View>

            <View
                style={{
                    minWidth: ITEM_WIDTH,
                    alignItems: 'center',
                    backgroundColor: '#1c1c1e',
                    paddingVertical: 12,
                    borderRadius: 10,
                    gap: 6,
                }}
            >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                    {completedCount}
                </Text>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                    Завершено
                </Text>
            </View>

            <Pressable
                onPress={() => router.push({ pathname: '/friends' })}
                style={{
                    minWidth: ITEM_WIDTH,
                    alignItems: 'center',
                    backgroundColor: '#1c1c1e',
                    paddingVertical: 12,
                    borderRadius: 10,
                    gap: 6,
                }}
            >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                    {friends}
                </Text>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                    Друзей
                </Text>
            </Pressable>
        </View>
    );
}