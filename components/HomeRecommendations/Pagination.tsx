import { useTheme } from '@/hooks/ThemeContext';
import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface PaginationProps {
    activeIndex: SharedValue<number>;
    length: number;
}

export const Pagination = ({ activeIndex, length }: PaginationProps) => {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <View style={styles.container}>
            <GlassView style={styles.pagination}>
                {Array.from({ length }).map((_, i) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        return {
                            width: 8,
                            height: 8,
                            borderRadius: 6,
                            backgroundColor: withTiming(activeIndex.value === i ? isDarkMode ? 'white' : 'orange' : 'rgba(255,255,255,0.7)'),
                            marginHorizontal: 4,
                        };
                    });

                    return <Animated.View key={i} style={animatedStyle} />
                })}
            </GlassView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pagination: {
        backgroundColor: 'rgba(95, 95, 95, 0.5)',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12
    }
});
