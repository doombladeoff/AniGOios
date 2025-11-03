
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
                name="anime/[id]"
                options={{
                    headerTransparent: true,
                    title: '',
                    headerLeft: () => <HeaderButton onPress={router.back} style={{ justifyContent: 'center', alignItems: 'center', width: 35, height: 35 }}>
                        <IconSymbol name="chevron.left" size={22} />
                    </HeaderButton>
                }}
            />
            <Stack.Screen
                name="anime/animeHistory"
                options={{
                    headerTransparent: Platform.Version >= '26.0' ? true : false,
                    ...(Platform.Version < '26.0' && {
                        headerStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    }),
                    title: "История просмотра",
                    headerTitleStyle: { color: isDarkMode ? 'white' : 'black' },
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerLeft: () => <HeaderButton onPress={router.back}
                        style={{ justifyContent: 'center', alignItems: 'center', width: 35, height: 35 }}
                    >
                        <IconSymbol name="chevron.left" size={22} />
                    </HeaderButton>
                }}
            />
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
                    headerLeft: () => <HeaderButton onPress={router.back} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <IconSymbol name="chevron.left" size={22} />
                    </HeaderButton>
                }}
            />
            <Stack.Screen
                name="anime/details"
                options={{
                    headerTitle: '',
                    headerBackTitle: "Аниме",
                    title: '',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerTransparent: true,
                    headerBackButtonMenuEnabled: true,
                    ...(Platform.Version >= '26.0' && {
                        headerLargeTitle: false,
                        headerStyle: undefined,
                        headerBackButtonDisplayMode: 'minimal'
                    }),
                }}
            />
            <Stack.Screen
                name="anime/animeByStudio"
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTitle: '',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerBackButtonDisplayMode: 'default',
                    headerBackTitle: 'Назад',
                    ...(Platform.Version < '26.0' && {
                        headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight',
                    }),
                }}
            />

            {/* comments */}
            <Stack.Screen
                name="comments/index"
                options={{
                    headerTitle: 'Комментарии',
                    title: 'Комментарии',
                    headerBackTitle: "Назад",
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerTransparent: true,
                    ...(Platform.Version >= '26.0' && {
                        headerLargeTitle: false,
                        headerStyle: undefined,
                    }),
                    ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterial' }),
                }}
            />
            <Stack.Screen
                name="comments/[id]"
                options={{
                    title: '',
                    headerTitle: '',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerBackButtonDisplayMode: Platform.Version >= '26.0' ? 'minimal' : 'default',
                    headerTransparent: true,
                    ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterial' }),
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
                name="settings/index"
                options={{
                    headerTransparent: true,
                    headerTitle: 'Настройки',
                    title: 'Настройки',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterialLight' }),
                    headerLeft: () => <HeaderButton onPress={router.back}
                        style={{ justifyContent: 'center', alignItems: 'center', width: 35, height: 35 }}
                    >
                        <IconSymbol name="chevron.left" size={22} />
                    </HeaderButton>,
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                }}
            />
            <Stack.Screen
                name="settings/homeRecommends"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerBackButtonDisplayMode: 'minimal',
                    headerTitle: 'Рекомендации',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerBackTitle: 'Настройки',
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                }}
            />
            <Stack.Screen
                name="settings/editProfile"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerBackButtonDisplayMode: 'minimal',
                    headerTitle: 'Профиль',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerBackTitle: 'Настройки'
                }}
            />
            <Stack.Screen
                name="settings/posterEditor"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerBackButtonDisplayMode: 'minimal',
                    headerTitle: '',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerBackTitle: 'Настройки'
                }}
            />
            <Stack.Screen
                name="settings/dev/dev-settings"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'DEV',
                    headerBackButtonDisplayMode: 'minimal',
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    headerBackTitle: 'Настройки'
                }}
            />
            <Stack.Screen
                name="user/[id]"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerBackButtonDisplayMode: Platform.Version >= '26.0' ? 'minimal' : 'default',
                    headerTintColor: 'white'
                }}
            />
            <Stack.Screen
                name="user/friends"
                options={{
                    headerShown: true,
                    headerTitle: 'Друзья',
                    title: "Друзья",
                    ...(Platform.Version >= '26.0' && { headerTransparent: true }),
                    ...(Platform.Version < '26.0' && { headerStyle: { backgroundColor: isDarkMode ? 'black' : 'white' } }),
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    headerLeft: () => (
                        <HeaderButton onPress={router.back}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 35, height: 35 }}
                        >
                            <IconSymbol name="chevron.left" size={22} />
                        </HeaderButton>
                    ),

                }}
            />
            <Stack.Screen
                name="folder"
                options={{
                    title: '',
                    headerTitle: '',
                    headerTransparent: true,
                    headerTintColor: isDarkMode ? 'white' : 'black',
                    contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    ...(Platform.Version < '26.0' && { headerBlurEffect: isDarkMode ? 'dark' : 'systemChromeMaterial' }),
                }}
            />
        </Stack>
    )
}