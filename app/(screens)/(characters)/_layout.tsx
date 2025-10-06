import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { useTheme } from "@/hooks/ThemeContext";
import { Stack } from "expo-router";

export default function CharactersLayout() {
    const isDarkMode = useTheme().theme === 'dark';

    return (
        <Stack screenOptions={{
            headerShown: false,
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerLeft: () => <HeaderBackButton />,
        }}>
            <Stack.Screen
                name="characters"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: isDarkMode ? 'dark' : 'light',
                    headerTitle: 'Персонажи',
                    title: 'Персонажи',
                }}
            />
            <Stack.Screen name="[id]"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Персонаж',
                    title: 'Персонаж',
                }}
            />
        </Stack>
    )
}