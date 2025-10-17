import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { useTheme } from "@/hooks/ThemeContext";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AnimeLayout() {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
        }}
        >
            <Stack.Screen
                name="[id]"
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => <HeaderBackButton />,
                }}
            />
            <Stack.Screen
                name="(comments)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="animeByGenre"
                options={{
                    headerTransparent: true,
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="lastUpdates"
                options={{
                    headerTransparent: true,
                    headerTitle: 'Обновления',
                    title: 'Обновления',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="animeHistory"
                options={{
                    headerTransparent: Platform.Version >= '26.0' ? true : false,
                    ...(Platform.Version < '26.0' && {
                        headerStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
                    }),
                    title: "История просмотра",
                    headerTintColor: 'white',
                    headerLeft: () => <HeaderBackButton />,
                }}
            />
        </Stack>
    )
}