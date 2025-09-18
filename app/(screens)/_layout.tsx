
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function ScreensLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(characters)"
                options={{
                    headerShown: false,
                    headerLeft: () => <HeaderBackButton />
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
                name="player"
                options={{
                    headerTransparent: true,
                    orientation: 'all',
                    headerTitle: '',
                    title: ''
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
        </Stack>
    )
}