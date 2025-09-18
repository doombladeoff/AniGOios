import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface OverlayProps {
    overlayStyle?: StyleProp<ViewStyle>;
    animatedStyle?: AnimatedStyle<ViewStyle>;
    pressFullScreen?: () => void;
    children: React.ReactNode;

};

export const Overlay = ({ overlayStyle, animatedStyle, pressFullScreen, children }: OverlayProps) => {
    return (
        <Animated.View style={[animatedStyle, overlayStyle]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 10, paddingTop: 20 }}>
                <Pressable
                    onPress={() => pressFullScreen && pressFullScreen()}
                    style={{ shadowColor: 'black', shadowOpacity: 0.65, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } }}
                >
                    <IconSymbol name="arrow.down.left.and.arrow.up.right.rectangle.fill" size={28} color={'white'} />
                </Pressable>
            </View>
            {children}
        </Animated.View>
    )
}