import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../ui/ThemedText";

interface ListHeaderProps {
    text: string;
    textStyle?: StyleProp<TextStyle>;
    iconName: SFSymbols6_0;
    iconColor?: string;
    iconSize: number;
    containerStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const ListHeader = (props: ListHeaderProps) => {
    return (
        <Pressable
            onPress={props.onPress}
            style={props.containerStyle}>
            <ThemedText style={props.textStyle}>{props.text}</ThemedText>
            <IconSymbol name={props.iconName} color={props.iconColor} size={16} />
        </Pressable>
    )
}