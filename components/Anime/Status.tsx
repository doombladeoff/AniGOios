import { auth, db } from "@/lib/firebase";
import { useHeaderHeight } from "@react-navigation/elements";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeInUp, FadeOutUp } from "react-native-reanimated";

const translatedStatus = {
    completed: "Просмотрено",
    planned: "В планах",
    watching: "Смотрю",
    dropped: "Брошено",
    on_hold: "Отложено",
} as const;

type StatusKey = keyof typeof translatedStatus;

function getStatus(status: string): string {
    return translatedStatus[status as StatusKey] ?? status;
}

const statusColors: Record<string, string> = {
    planned: "orange",
    completed: "green",
    watching: "skyblue",
    dropped: "red",
    on_hold: "gray",
};

interface StatusProps {
    showType: "header" | "poster";
    id: string;
    status?: string;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}
export const Status = ({ showType, id, status, textStyle, containerStyle }: StatusProps) => {
    const headerHeight = useHeaderHeight();
    const showInHeader = showType === "header";

    const [statusHeader, setStatus] = useState('');

    useEffect(() => {
        if (!auth.currentUser || status) return;

        const animeRef = doc(
            db,
            "user-favorites",
            auth.currentUser.uid,
            "favorites",
            String(id)
        );

        const unsubscribe = onSnapshot(animeRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setStatus(data.status ?? '');
            } else {
                setStatus('')
            }
        });

        return () => unsubscribe();
    }, [id, auth.currentUser?.uid, status]);

    const resolvedStatus = status ?? statusHeader;

    const bgColor = statusColors[resolvedStatus] ?? "transparent";
    const fontSize = status ? 12 : 15;

    if (!resolvedStatus) return null;

    return (
        <Animated.View
            entering={showInHeader ? FadeInUp : FadeIn}
            exiting={FadeOutUp}
            style={[
                { top: showInHeader ? headerHeight / 1.55 : 5 },
                containerStyle,
            ]}
        >
            <View style={[styles.statusView, { backgroundColor: bgColor }]}>
                <Text style={[styles.text, { fontSize }]}>
                    {getStatus(resolvedStatus)}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    statusView: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    text: {
        color: "white",
        fontWeight: "500",
    }
})