import { Host, Picker } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

export const YearPicker = ({ selectedIndex, typeYear, setValue, onValid, arr }: {
    selectedIndex: number;
    typeYear: "yearFrom" | "yearTo";
    setValue: any;
    onValid: () => void;
    arr: any
}) => {
    return (
        <Host matchContents>
            <Picker
                options={arr}
                selectedIndex={selectedIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                    const year = 2000 + index;
                    setValue(typeYear, year, { shouldValidate: true });
                    onValid();
                }}
                variant="wheel"
                modifiers={[frame({ width: 100, height: 100 })]}
            />
        </Host>
    )
};