import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

export const DynamicStatusBar = ({ uri }: { uri: string }) => {
    const [isDark, setIsDark] = useState(false);

    function getBrightness(color: string) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return (r * 299 + g * 587 + b * 114) / 1000;
        }
        return 0;
    };

    useEffect(() => {
        if (!uri) return;

        ImageColors.getColors(uri, { fallback: '#000000' }).then(colors => {
            let color = colors.platform === 'ios' && colors.background || '#000000';
            const brightness = getBrightness(color);
            console.log('brightness', brightness)
            setIsDark(brightness < 230);
        });
    }, [uri]);

    return (
        <StatusBar
            style={isDark ? 'light' : 'dark'}
            animated
        />
    );
};