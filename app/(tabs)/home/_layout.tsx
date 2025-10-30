import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { router, Stack } from "expo-router";
import { Platform } from "react-native";
import { BlurEffectTypes } from "react-native-screens";

const isIOS26 = Platform.Version >= '26.0';

const screenOptionsWithTheme = (isDark: boolean) => {
    const blur: BlurEffectTypes | undefined =
        !isIOS26
            ? (isDark ? "dark" : "systemChromeMaterialLight")
            : undefined;

    return {
        headerShown: true,
        headerTransparent: true,
        headerTintColor: isDark ? "white" : "black",
        headerTitle: "",
        headerBackTitle: 'Назад',
        title: "",
        contentStyle: { backgroundColor: isDark ? "black" : "white" },
        ...(blur ? { headerBlurEffect: blur } : {}),
    } as const;
};

const HeaderLeft = () => (
    <ThemedText
        style={{
            fontSize: 26,
            fontWeight: "800",
            paddingHorizontal: 10,
        }}
    >
        AniGO
    </ThemedText>
);

export default function HomeLayout() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Stack screenOptions={screenOptionsWithTheme(isDark)}>
            <Stack.Screen
                name="index"
                options={{
                    unstable_headerRightItems: () => [
                        {
                            type: 'button',
                            label: 'Календарь',
                            icon: {
                                type: 'sfSymbol',
                                name: 'calendar',
                            },
                            onPress: () => router.push('/home/calendar'),
                        },
                        {
                            type: 'spacing',
                            spacing: 10,
                        },
                        {
                            type: 'button',
                            label: 'Избранное',
                            tintColor: 'orange',
                            icon: {
                                type: 'sfSymbol',
                                name: 'bookmark.fill',
                            },
                            onPress: () => router.push('/home/favorite'),
                        },
                    ],
                    headerLeft: () => <HeaderLeft />,
                    headerShadowVisible: false,
                }}
            />

            <Stack.Screen
                name="animelist"
                options={{
                    headerBackButtonDisplayMode: isIOS26 ? "minimal" : 'default',
                }}
            />

            <Stack.Screen
                name="favorite"
                options={{
                    headerTitle: "Избранное",
                    headerBackButtonDisplayMode: isIOS26 ? "minimal" : 'default',
                }}
            />

            <Stack.Screen
                name="calendar"
                options={{
                    headerTitle: "Календарь",
                    headerBackButtonDisplayMode: isIOS26 ? "minimal" : 'default',
                }}
            />
        </Stack>
    );
}
