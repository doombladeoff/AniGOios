import { formatTime } from "@/utils/playerHelper";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface PlayerSliderProps {
    style?: AnimatedStyle<ViewStyle>;
    currentTime: number;
    duration: number;
    maximumValue: number;
    onSlidingStart?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    onValueChange?: (value: number) => void;
    isSliding?: boolean;
}

export const PlayerSlider = ({ style, currentTime, duration, maximumValue, onSlidingComplete, onSlidingStart, onValueChange, isSliding }: PlayerSliderProps) => {
    const [slideValue, setSlideValue] = useState(0);

    return (
        <Animated.View style={[style, { paddingHorizontal: 12, width: '100%', }]}>
            <Slider
                value={currentTime}
                minimumValue={0}
                maximumValue={maximumValue}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="transparent"
                style={{ height: 40, width: '100%', shadowColor: 'black', shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }}
                onSlidingComplete={(v) => onSlidingComplete && onSlidingComplete(v)}
                onSlidingStart={(v) => onSlidingStart && onSlidingStart(v)}
                onValueChange={(v) => { onValueChange && onValueChange(v); setSlideValue(v) }}
            />
            <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ shadowColor: 'black', shadowOpacity: 1, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } }}>
                    <Text style={{ color: "white" }}>{isSliding ? formatTime(slideValue) : formatTime(currentTime)}</Text>
                </View>
                <Text style={{ color: "white" }}>{formatTime(duration)}</Text>
            </View>
        </Animated.View>
    )
}