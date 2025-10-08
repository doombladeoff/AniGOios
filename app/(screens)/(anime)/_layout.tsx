import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function AnimeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    orientation: 'portrait',
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => <HeaderBackButton />,
                }}
            />
            <Stack.Screen name="(comments)" options={{ headerShown: false }} />
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
                options={{ title: 'История', headerLeft: () => <HeaderBackButton />, headerTransparent: true }}
            />
        </Stack>
    )
}