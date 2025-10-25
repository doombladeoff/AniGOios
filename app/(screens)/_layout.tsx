
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/ThemeContext";
import { HeaderButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import { Platform } from "react-native";

const isIOS26 = Platform.Version >= "26.0";

export default function ScreensLayout() {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <Stack>
            {/* characters */}
            <Stack.Screen
                name="characters/index"
                options={{
                    title: "Персонажи",
                    headerTitle: 'Персонажи',
                    headerShown: true,
                    headerTransparent: true,
                    headerTitleStyle: { color: isDarkMode ? 'white' : 'black' },
                    headerBackTitle: 'Назад',
                    ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight' }),
                    ...(Platform.Version >= '26.0' && { headerLargeTitle: true }),
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerTintColor: isDarkMode ? 'white' : 'black'
                }}
            />
            <Stack.Screen
                name="characters/[id]"
                options={{
                    headerTitle: 'Персонаж',
                    title: 'Персонаж',
                    headerTransparent: true,
                    headerTitleStyle: { color: isDarkMode ? 'white' : 'black' },
                    headerBackButtonDisplayMode: 'minimal',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                }}
            />

            {/* anime */}
            <Stack.Screen
                name="anime/animeByGenre"
                options={{
                    title: "",
                    headerTransparent: true,
                    headerTitleStyle: { color: isDarkMode ? 'white' : 'black' },
                    headerBackTitle: 'Назад',
                    ...(Platform.Version < '26.0' && {
                        headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight',
                    }),
                    ...(Platform.Version >= '26.0' && {
                        headerBackButtonDisplayMode: 'minimal',
                    }),
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerTintColor: isDarkMode ? 'white' : 'black',
                }}
            />
            <Stack.Screen
                name="anime/lastUpdates"
                options={{
                    headerTitle: 'Обновления',
                    headerBackTitle: "Назад",
                    title: 'Обновления',
                    headerStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    ...(Platform.Version >= '26.0' && {
                        headerTransparent: true,
                        headerLargeTitle: false,
                        headerStyle: undefined,
                    }),
                    headerLeft: () => <HeaderButton onPress={router.back}>
                        <IconSymbol name="chevron.left" size={22} />
                    </HeaderButton>
                }}
            />
            <Stack.Screen
                name="error"
                options={{
                    headerStyle: { backgroundColor: 'black' },
                    headerTitle: 'Обновления',
                    title: 'Обновления',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="(settings)"
                options={{
                    headerShown: false,
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="(user)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(anime)"
                options={{
                    headerShown: false,
                    headerTransparent: true,
                    title: '',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="folder"
                options={{
                    ...(isIOS26 && { headerTransparent: true }),
                    headerTintColor: isDarkMode ? 'white' : 'black'
                }}
            />
        </Stack>
    )
}