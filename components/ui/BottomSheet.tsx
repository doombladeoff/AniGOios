import { useEffect } from "react";
import { Modal, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export const BottomSheet = ({ isOpen, children, onRequest }: { isOpen: boolean; children: React.ReactNode; onRequest?: (v: boolean) => void; }) => {
    const modalOpacity = useSharedValue(0);

    useEffect(() => {
        modalOpacity.value = 0;
        modalOpacity.value = withTiming(isOpen ? 0.6 : 0, {
            duration: 500,
        });
    }, [isOpen]);

    const modalOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: modalOpacity.value,
        };
    });
    return (
        <>
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        backgroundColor: "black",
                        height: "100%",
                        width: "100%",
                        zIndex: 20,
                    },
                    modalOpacityStyle
                ]}
            />
            <Modal visible={isOpen} transparent animationType='slide'>
                <Pressable style={{ width: '100%', height: '100%', position: 'absolute' }} onPress={() => onRequest && onRequest(false)} />
                <View style={{
                    position: "absolute",
                    width: "100%",
                    justifyContent: "flex-end",
                    zIndex: 1,
                    bottom: 0,
                }}>

                    {children}
                </View>
            </Modal>
        </>
    )
}