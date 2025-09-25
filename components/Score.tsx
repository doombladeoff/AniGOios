import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

interface ScoreProps {
    containerStyle?: StyleProp<ViewStyle>;
    scoreText: string | number;
    scoreTextStyle?: StyleProp<TextStyle>;
}
export const Score = (props: ScoreProps) => {
    return (
        <View style={props.containerStyle}>
            <Text style={props.scoreTextStyle}>{props.scoreText}</Text>
        </View>
    )
}