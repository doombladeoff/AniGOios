import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { Link, Stack } from "expo-router";
import { Platform, Pressable, View } from "react-native";
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

const HeaderRight = () => {
    return (
        <View style={{ width: 90, height: 35, marginHorizontal: 5, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
            <Link href={'/home/calendar'} asChild>
                <Pressable style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                    <IconSymbol name="calendar" size={26} />
                </Pressable>
            </Link>
            <View style={{ height: 25, width: 1, backgroundColor: 'rgba(90,90,90,0.5)' }} />
            <Link href={'/home/favorite'} asChild>
                <Pressable style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                    <IconSymbol name="bookmark.fill" size={26} color={'orange'} />
                </Pressable>
            </Link>
        </View>
    );
};

export default function HomeLayout() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Stack screenOptions={screenOptionsWithTheme(isDark)}>
            <Stack.Screen
                name="index"
                options={{
                    headerLeft: () => <HeaderLeft />,
                    headerRight: () => <HeaderRight />,
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
