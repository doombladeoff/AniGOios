import { Button } from "@/components/ui/Button";
import { AnimationSpec } from "expo-symbols";
import { memo } from "react";

interface SeekBtnProps {
    onPress: () => void;
    iconSeekTime: string;
    type?: 'left' | 'right';
};

const animationButtons = {
    'skipLeftRigt': {
        effect: {
            type: 'bounce',
            direction: 'down',
        },
        speed: 10,
    } as AnimationSpec,
}

const SeekBtn = ({ onPress, iconSeekTime, type }: SeekBtnProps) => {
    const direction = type === 'left' ? 'counterclockwise' : 'clockwise';
    return (
        <Button
            width={35}
            height={35}
            iconName={`${iconSeekTime}.arrow.trianglehead.${direction}`}
            iconSize={32}
            onPressBtn={onPress}
            style={{ shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } }}
            animationSpec={animationButtons['skipLeftRigt']}
        />
    )
}

export default memo(SeekBtn);