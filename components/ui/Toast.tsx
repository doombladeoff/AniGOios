import { useHeaderHeight } from "@react-navigation/elements";
import { memo, useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import { IconSymbol } from "./IconSymbol";

interface ToastProps {
    show: boolean;
    setShow: (v: boolean) => void;
    text: string;
    iconName: SFSymbols6_0;
    iconSize: number;
    iconColor: string;
}
const Toast = memo(({ show, setShow, text, iconName, iconSize, iconColor }: ToastProps) => {
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        if (show) {
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 5000);

            setTimeout(() => { setShow(false) }, 5200)
        }
    }, [show])

    return (
        <>
            {show && (
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: "absolute",
                        top: headerHeight + 12,
                        left: 16,
                        right: 16,
                        backgroundColor: "#222",
                        paddingVertical: 24,
                        paddingHorizontal: 28,
                        borderRadius: 18,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.18,
                        shadowRadius: 8,
                        elevation: 8,
                        opacity: toastOpacity,
                        zIndex: 99999,
                        transform: [
                            {
                                translateY: toastOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                        ],
                    }}
                >
                    <IconSymbol name={iconName} size={iconSize} color={iconColor} />
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 17,
                            fontWeight: '600',
                            marginLeft: 12,
                            flexShrink: 1,
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {text}
                    </Text>
                </Animated.View>
            )}
        </>
    )
})

export default Toast;