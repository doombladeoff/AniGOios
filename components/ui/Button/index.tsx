import { Host, HStack, Button as UIButtonElm, Image as UIImage } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { AnimationSpec } from "expo-symbols";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import { IconSymbol } from "../IconSymbol.ios";

interface ButtonProps {
    width: number;
    height: number;
    onPressBtn?: () => void;
    iconName: SFSymbols6_0;
    iconColor?: string;
    iconSize?: number;
    animationSpec?: AnimationSpec;
    style?: StyleProp<ViewStyle>;
}

/** 
 * Использует нативные элементы системы, для стандартной кнопки использовать Button
 * 
*/
const UIButton = ({ width, height, onPressBtn, iconName, iconColor = 'white', iconSize = 44, style }: ButtonProps) => {
    return (
        <Host style={[{ width, height }, style]}>
            <HStack modifiers={[frame({ width, height })]}>
                <UIButtonElm onPress={onPressBtn} modifiers={[frame({ width, height })]}>
                    <UIImage systemName={iconName} color={iconColor} size={iconSize} modifiers={[frame({ width, height })]} />
                </UIButtonElm>
            </HStack>
        </Host>
    )
}

const Button = ({ width, height, onPressBtn, iconName, iconColor = 'white', iconSize = 44, animationSpec, style }: ButtonProps) => {
    return (
        <Pressable
            onPress={onPressBtn}
            style={[{ width, height }, style]}
        >
            <IconSymbol name={iconName} size={iconSize} color={iconColor} animationSpec={animationSpec} />
        </Pressable>
    )
}

export { Button, UIButton };
