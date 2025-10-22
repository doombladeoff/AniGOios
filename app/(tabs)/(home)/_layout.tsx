import { UIButton } from "@/components/ui/Button";
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { router, Stack } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useMemo } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";

const defaultOptions: ExtendedStackNavigationOptions = {
    headerBackTitle: "Back",
    headerShown: true,
    headerTransparent: true,
    headerTitle: '',
    title: '',
    headerLeft: () => <HeaderBackButton />,
}

export default function HomeLayout({ segment }: { segment: string }) {
    const isDarkMode = useTheme().theme === 'dark';
    const rootScreen = useMemo(() => {
        switch (segment) {
            case "(home)":
                return (
                    <Stack.Screen
                        name="index"
                        options={{
                            ...defaultOptions,
                            headerLeft: () => (
                                <Animated.View entering={FadeInUp.delay(1000)}>
                                    <ThemedText style={{ fontSize: 26, fontWeight: '800', paddingHorizontal: 10 }}>AniGO</ThemedText>
                                </Animated.View>
                            ),

                            headerRight: () => (
                                <Animated.View hitSlop={20} entering={FadeInUp.delay(1000)} style={{ width: 35, height: 35 }}>
                                    <UIButton
                                        width={35}
                                        height={35}
                                        onPressBtn={() => router.push({ pathname: '/(tabs)/(home)/favorite' })}
                                        iconName="bookmark.fill"
                                        iconSize={22}
                                        iconColor="orange"
                                    />
                                </Animated.View>
                            ),
                        }}
                    />
                );
        }
    }, [segment]);

    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                headerTintColor: isDarkMode ? 'white' : 'black',
                contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' }
            }}>
            {rootScreen}
            <Stack.Screen
                name="animelist"
                options={{
                    ...defaultOptions,
                    headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="favorite"
                options={{
                    ...defaultOptions,
                    headerTitle: 'Избранное',
                }}
            />
        </Stack>
    );
}
