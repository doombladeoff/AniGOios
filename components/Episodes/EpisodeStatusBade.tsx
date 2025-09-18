import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { IconSymbol } from '../ui/IconSymbol';

const getStatusColorValue = (status: number) => {
    switch (status) {
        case 1: return 1; // green
        case 2: return 2; // orange
        default: return 0; // red
    }
};

export const EpisodeBadgeStatus = ({ episodeNumber, status }: {
    episodeNumber: number;
    status: number;
}) => {
    console.log('Ep', episodeNumber, 'status', status)
    const statusValue = useSharedValue(getStatusColorValue(status));

    useEffect(() => {
        statusValue.value = withTiming(getStatusColorValue(status), { duration: 300 });
    }, [status]);

    const animatedStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            statusValue.value,
            [0, 1, 2],
            ['red', 'green', 'orange']
        );
        return {
            backgroundColor: bgColor,
        };
    });

    return (
        <Animated.View style={[{
            position: 'absolute',
            zIndex: 2,
            top: 10,
            left: 10,
            minWidth: 20,
            paddingHorizontal: 12,
            paddingVertical: 2,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
        }, animatedStyle]}>
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                Эп. {episodeNumber}
            </Text>
            {(status === 1 || status === 2) && <IconSymbol name={status === 1 ? 'checkmark' : 'calendar'} size={12} color={'white'} />}
        </Animated.View>

    );
};
