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

export const CustomTabBar = ({
    state,
    descriptors,
    navigation,
    insets
}: BottomTabBarProps) => {
    const { width } = useWindowDimensions();
    const [tabBarWidth, setTabBarWidth] = useState(0);

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
                tint='systemChromeMaterial'
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
                colors={['transparent', 'rgba(0,0,0,0.35)', 'black']}
                style={[styles.bottomGradeint, { height: insets.bottom * 2.5 }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
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
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 8
    },
    bottomGradeint: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: -1
    }
})
