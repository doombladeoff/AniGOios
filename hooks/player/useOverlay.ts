import { useEffect, useRef, useState } from "react";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export const useOverlay = ({
    autoHideMs = 5000,
    initialShown = true,
    isSliding,
    isPlaying,
}: {
    autoHideMs?: number;
    initialShown?: boolean;
    isSliding: boolean;
    isPlaying: any;
}) => {
    const [showOverlay, setShowOverlay] = useState(initialShown);
    const timerRef = useRef<number | null>(null);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        backgroundColor: 'rgba(0,0,0,0.45)'
    }));

    useEffect(() => {
        if (showOverlay && !isSliding) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setShowOverlay(false);
                opacity.value = withTiming(!isPlaying ? 1 : 0, { duration: 800 });
            }, autoHideMs);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [showOverlay, isPlaying]);

    const handleInteraction = () => { setShowOverlay(true); opacity.value = withTiming(1, { duration: 300 }); };

    return {
        handleInteraction,
        animatedStyle,
        showOverlay,
    }
}