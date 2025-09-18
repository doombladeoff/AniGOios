import { auth, db } from "@/lib/firebase";
import { useHeaderHeight } from "@react-navigation/elements";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

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

interface StatusProps {
    showType: "header" | "poster";
    id: string;
    status?: string;
    textStyle?: StyleProp<TextStyle>;
}
export const Status = ({ showType, id, status, textStyle }: StatusProps) => {
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
            }
        });

        return () => unsubscribe();
    }, [id, auth.currentUser?.uid]);

    if (statusHeader.length < 1 && !status) return null;

    return (
        <Animated.View
            key={status ? status : statusHeader}
            entering={showInHeader ? FadeInUp : FadeIn}
            style={{
                top: showInHeader ? headerHeight / 1.55 : 5,
                zIndex: 200,
                position: "absolute",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
            }}
        >
            {status ? (
                <Text
                    style={[{
                        color: "white",
                        backgroundColor:
                            status === "planned"
                                ? "orange"
                                : status === "completed"
                                    ? "green"
                                    : status === "watching"
                                        ? "skyblue"
                                        : status === "dropped"
                                            ? "red"
                                            : status === "on_hold"
                                                ? "gray"
                                                : "transparent",
                    }, textStyle ? textStyle : {
                        borderRadius: 6,
                        top: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        fontSize: 14,
                        fontWeight: "500",
                    }]}
                >
                    {getStatus(status)}
                </Text>
            ) : (
                <Text
                    style={[{
                        color: "white",
                        backgroundColor:
                            statusHeader === "planned"
                                ? "orange"
                                : statusHeader === "completed"
                                    ? "green"
                                    : statusHeader === "watching"
                                        ? "skyblue"
                                        : statusHeader === "dropped"
                                            ? "red"
                                            : statusHeader === "on_hold"
                                                ? "gray"
                                                : "transparent",
                    }, textStyle ? textStyle : {
                        borderRadius: 6,
                        top: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        fontSize: 14,
                        fontWeight: "500",
                    }]}
                >
                    {getStatus(statusHeader)}
                </Text>
            )
            }

        </Animated.View >
    );
};
