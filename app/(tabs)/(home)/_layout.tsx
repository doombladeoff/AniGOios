import { UIButton } from "@/components/ui/Button";
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { auth } from "@/lib/firebase";
import { router, Stack } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useMemo } from "react";
import { Platform, Text, View } from "react-native";
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
    const rootScreen = useMemo(() => {
        switch (segment) {
            case "(home)":
                return (
                    <Stack.Screen
                        name="home"
                        options={{
                            ...defaultOptions,
                            headerLeft: () => {
                                if (Platform.Version < '26.0')
                                    return (
                                        <Animated.View entering={FadeInUp.delay(1000)}>
                                            <View>
                                                <Text style={{ color: 'white', fontSize: 26, fontWeight: '800' }}>AniGO</Text>
                                            </View>
                                        </Animated.View>
                                    )
                                return undefined;
                            },
                            headerRight: () => {
                                if (Platform.Version < '26.0' && auth.currentUser)
                                    return (
                                        <Animated.View hitSlop={20} entering={FadeInUp.delay(1000)}>
                                            <UIButton
                                                width={35}
                                                height={35}
                                                onPressBtn={() => router.push({ pathname: '/(tabs)/(home)/favorite' })}
                                                iconName="bookmark.fill"
                                                iconSize={22}
                                                iconColor="orange"
                                            />
                                        </Animated.View>
                                    )
                                return undefined
                            }
                        }}
                    />
                );
        }
    }, [segment]);

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }}>
            {rootScreen}
            <Stack.Screen
                name="animelist"
                options={defaultOptions}
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
