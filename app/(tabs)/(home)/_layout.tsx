import { UIButton } from "@/components/ui/Button";
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { Host, HStack } from "@expo/ui/swift-ui";
import { router, Stack } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useMemo } from "react";
import { Platform } from "react-native";

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
                            ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight' }),
                            headerShadowVisible: false,
                            headerLeft: () => (
                                <ThemedText style={{ fontSize: 26, fontWeight: '800', paddingHorizontal: 10 }}>AniGO</ThemedText>
                            ),

                            headerRight: () => (
                                <Host matchContents style={{ width: 90, height: 35 }}>
                                    <HStack spacing={10}>
                                        <UIButton
                                            width={35}
                                            height={35}
                                            onPressBtn={() => router.push({ pathname: '/calendar' })}
                                            iconName="calendar"
                                            iconSize={22}
                                            iconColor={isDarkMode ? 'white' : 'black'}
                                        />
                                        <UIButton
                                            width={35}
                                            height={35}
                                            onPressBtn={() => router.push({ pathname: '/(tabs)/(home)/favorite' })}
                                            iconName="bookmark.fill"
                                            iconSize={22}
                                            iconColor="orange"
                                        />
                                    </HStack>
                                </Host>
                            ),
                        }}
                    />
                );
        }
    }, [segment, isDarkMode]);

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
