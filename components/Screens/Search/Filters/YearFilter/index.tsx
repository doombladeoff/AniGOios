import { useSearchStore } from "@/store/filterStore";
import { memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useShallow } from "zustand/shallow";
import { YearPicker } from "./YearPicker";

const screenWidth = Dimensions.get("window").width;

const currentYear = new Date().getFullYear();
const arr = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => String(2000 + i)
);

function YearFilter() {
    const { yearRange, setYearRange } = useSearchStore(
        useShallow((state) => ({
            yearRange: state.yearRange,
            setYearRange: state.setYearRange
        }))
    );

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

    const yearFrom = watch("yearFrom");
    const yearTo = watch("yearTo");

    const rangeError = useMemo(
        () => Number(yearFrom) > Number(yearTo) ? "Начальный год не может быть больше конечного" : "",
        [yearFrom, yearTo]
    );

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
        <View>
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
                    <YearPicker
                        arr={arr}
                        selectedIndex={getSelectedIndex(Number(getValues("yearFrom")), yearRange.from)}
                        typeYear='yearFrom'
                        setValue={setValue}
                        onValid={() => handleSubmit(onValid)()}
                    />
                    <Text style={{ color: 'white' }}>От</Text>
                </View>

                <View style={[{ height: 1, backgroundColor: 'white', marginHorizontal: 10, left: 0, marginBottom: 30, width: screenWidth * 0.28 }]} />

                <View style={{ alignItems: 'center', gap: 10 }}>
                    <YearPicker
                        arr={arr}
                        selectedIndex={getSelectedIndex(Number(getValues("yearTo")), yearRange.to)}
                        typeYear='yearTo'
                        setValue={setValue}
                        onValid={() => handleSubmit(onValid)()}
                    />
                    <Text style={{ color: 'white' }}>До</Text>
                </View>
            </View>
        </View>
    )
}

export default memo(YearFilter);