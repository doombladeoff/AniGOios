import { BlurView } from "expo-blur";
import { memo, useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol.ios";

interface InputProps {
    initialValue?: string;
    onSearch?: (text: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    debounceTime?: number;
}

const Input = ({ initialValue = "", onSearch, containerStyle, debounceTime = 400 }: InputProps) => {
    console.log('render input')
    const [localValue, setLocalValue] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch?.(localValue);
        }, debounceTime);

        return () => clearTimeout(handler);
    }, [localValue]);

    return (
        <View style={containerStyle}>
            <BlurView
                tint="systemMaterial"
                intensity={80}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 18,
                    height: 54,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                }}
            >
                <IconSymbol
                    name="magnifyingglass"
                    size={22}
                    color="#aaa"
                    style={{ marginRight: 8 }}
                />
                <TextInput
                    value={localValue}
                    onChangeText={setLocalValue}
                    style={{
                        flex: 1,
                        color: "white",
                        fontSize: 17,
                        fontWeight: "500",
                        backgroundColor: "transparent",
                        paddingVertical: 0,
                    }}
                    placeholder="Поиск аниме"
                    placeholderTextColor="#aaa"
                    selectionColor="#007AFF"
                />
                {localValue.length > 0 && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Pressable onPress={() => setLocalValue("")} style={{ marginLeft: 8 }}>
                            <IconSymbol name="xmark.circle.fill" size={22} color="#bbb" />
                        </Pressable>
                    </Animated.View>
                )}
            </BlurView>
        </View>
    );
};

export default memo(Input);
