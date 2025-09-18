import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSearchStore } from "@/store/filterStore";
import { Host, Picker } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import * as Haptics from 'expo-haptics';
import { memo } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Pressable, StyleProp, Text, TextInputProps, TextStyle, View } from "react-native";
import Animated, { FadeIn, FadeOut, interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

interface YearFilterProps extends TextInputProps {
    inputStyle?: StyleProp<TextStyle>;
}

const screenWidth = Dimensions.get("window").width;
const offset = screenWidth * 0.6;

const currentYear = new Date().getFullYear();
const arr = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => String(2000 + i)
);

function YearFilter(props: YearFilterProps) {
    const yearRange = useSearchStore(state => state.yearRange);
    const setYearRange = useSearchStore(state => state.setYearRange);
    const expanded = useSharedValue(1);// def 0

    const {
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            yearFrom: yearRange.from,
            yearTo: yearRange.to
        },
        mode: "onChange",
    });

    const onValid = ({ yearFrom, yearTo }: { yearFrom: string | number; yearTo: string | number }) => {
        const from = Number(yearFrom)
        const to = Number(yearTo)

        if (from > to) {
            return;
        } else if (from <= to) {
            setYearRange(from, to);
        }
    };

    const animStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(expanded.value, [0, 1], [0, offset - 10]) }],
        opacity: interpolate(expanded.value, [0, 1], [0, 1]),
    }));

    const separatorStyles = useAnimatedStyle(() => ({
        width: interpolate(expanded.value, [0, 1], [0, screenWidth * 0.28]),
        opacity: withDelay(
            50,
            withTiming(expanded.value, { duration: 300 }) // expanded.value 0 → 1
        ),
        height: 1,
        backgroundColor: "white",
    }));
    const btnS = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(expanded.value, [0, 1], [10, offset - 10]) }],
    }));

    const handlePress = () => {
        expanded.value = withTiming(expanded.value === 0 ? 1 : 0, { duration: 700 });
        Haptics.selectionAsync();
    };

    const plusStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expanded.value, [0, 1], [1, 0]),
        transform: [
            {
                rotate: `${interpolate(expanded.value, [0, 1], [0, 45])}deg`,
            },
        ],
    }));

    const minusStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expanded.value, [0, 1], [0, 1]),
        transform: [
            {
                rotate: `${interpolate(expanded.value, [0, 1], [-45, 0])}deg`,
            },
        ],
    }));

    const yearFrom = watch("yearFrom");
    const yearTo = watch("yearTo");

    const rangeError = Number(yearFrom) > Number(yearTo) ? "Начальный год не может быть больше конечного" : '';

    const getSelectedIndex = (val: number, fallback: number) => {
        if (val && !isNaN(val) && val >= 2000 && val <= currentYear) {
            return val - 2000;
        }
        if (fallback && !isNaN(fallback) && fallback >= 2000 && fallback <= currentYear) {
            return fallback - 2000;
        }
        return 0; // дефолт если совсем пусто
    };

    return (
        <>
            {rangeError ? (
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                    style={{ marginTop: 10 }}
                >
                    <Animated.Text
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        style={{ color: "red", fontSize: 12 }}
                    >
                        {rangeError}
                    </Animated.Text>
                </Animated.View>
            ) : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <Host matchContents>
                        <Picker
                            options={arr}
                            selectedIndex={getSelectedIndex(Number(getValues("yearFrom")), yearRange.from)}
                            onOptionSelected={({ nativeEvent: { index } }) => {
                                const year = 2000 + index;
                                setValue("yearFrom", year, { shouldValidate: true });
                                handleSubmit(onValid)();
                            }}
                            variant="wheel"
                            modifiers={[frame({ width: 100, height: 100 })]}
                        />
                    </Host>
                    <Text style={{ color: 'white' }}>От</Text>
                </View>


                <Animated.View style={[{ position: "relative", width: 24, height: 24, marginBottom: 20 }, btnS]}>
                    <Animated.View style={[{ position: "absolute", top: 0, left: 0 }, plusStyle]}>
                        <IconSymbol name="plus" size={24} color="white" />
                    </Animated.View>
                    <Animated.View style={[{ position: "absolute", top: 0, left: 0 }, minusStyle]}>
                        <IconSymbol name="minus" size={24} color="white" />
                    </Animated.View>

                    <Pressable
                        onPress={handlePress}
                        style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24 }}
                    />
                </Animated.View>

                <Animated.View style={[{ height: 1, backgroundColor: 'red', marginHorizontal: 10, left: -45, marginBottom: 30 }, separatorStyles]} />
                <Animated.View style={[{ position: 'absolute', opacity: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }, animStyles]}>
                    <View style={{ alignItems: 'center', gap: 10 }}>
                        <Host matchContents>
                            <Picker
                                options={arr}
                                selectedIndex={getSelectedIndex(Number(getValues("yearTo")), yearRange.to)}
                                onOptionSelected={({ nativeEvent: { index } }) => {
                                    const year = 2000 + index;
                                    setValue("yearTo", year, { shouldValidate: true });
                                    handleSubmit(onValid)();
                                }}
                                variant="wheel"
                                modifiers={[frame({ width: 100, height: 100 })]}
                            />
                        </Host>
                        <Text style={{ color: 'white' }}>До</Text>
                    </View>
                </Animated.View >
            </View>
        </>
    )
}

export default memo(YearFilter);