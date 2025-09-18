import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

interface ScoreBadgeProps {
    score: number;
    anons: boolean;
    horizontal: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const ScoreBadge = ({ score, anons, horizontal, containerStyle, textStyle }: ScoreBadgeProps) => {
    return (
        <View
            style={[
                {
                    left: horizontal ? 0 : 5,
                    top: horizontal ? 10 : 5,
                    backgroundColor: anons ? 'red' : '#50ca2bff',
                },
                containerStyle
            ]}
        >
            <Text style={textStyle}>{score}</Text>
        </View>
    )
}

export default ScoreBadge;