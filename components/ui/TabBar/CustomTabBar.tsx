import { useTheme } from "@/hooks/ThemeContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import TabItem from "./TabItem";

const Gradeint = {
    dark: ['transparent', 'rgba(0,0,0,0.35)', 'black'] as const,
    light: ['transparent', 'rgba(255, 255, 255, 0.35)', 'white'] as const
};

export const CustomTabBar = ({
    state,
    descriptors,
    navigation,
    insets
}: BottomTabBarProps) => {
    const { width } = useWindowDimensions();
    const [tabBarWidth, setTabBarWidth] = useState(0);

    const isDarkMode = useTheme().theme === 'dark';

    const containerWidth = tabBarWidth - 20;
    const tabWidth = containerWidth / state.routes.length;
    const indicatorWidth = tabWidth - 16;
    const indocatorPadding = state.index * 5;

    const translateX = useSharedValue(state.index * indicatorWidth + 24);

    useEffect(() => {
        translateX.value = withSpring(state.index * tabWidth + indocatorPadding, {
            stiffness: 300,
            damping: 44,
        });
    }, [state.index, tabWidth]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={styles.container}>
            <BlurView
                tint={isDarkMode ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
                intensity={100}
                style={[
                    styles.tabView,
                    {
                        width: width - 40,
                        bottom: insets.bottom,
                    }
                ]}
                onLayout={(e) => {
                    console.log(e.nativeEvent.layout.height)
                    setTabBarWidth(e.nativeEvent.layout.width);
                }}
            >
                {tabBarWidth > 0 && (
                    <Animated.View style={[
                        indicatorStyle,
                        styles.indicator,
                        { width: indicatorWidth }
                    ]}
                    />
                )}
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    return (
                        <TabItem
                            key={route.key}
                            route={route}
                            isFocused={isFocused}
                            options={options}
                            navigation={navigation}
                        />
                    );
                })}
            </BlurView>
            <LinearGradient
                colors={isDarkMode ? Gradeint.dark : Gradeint.light}
                style={[styles.bottomGradeint, { height: insets.bottom * 2.5 }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 100
    },
    tabView: {
        alignSelf: "center",
        flexDirection: "row",
        position: "absolute",
        paddingVertical: 16,
        borderRadius: 28,
        overflow: "hidden",
    },
    indicator: {
        height: 42,
        position: "absolute",
        backgroundColor: "orange",
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 18,
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomGradeint: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: -1
    }
})
