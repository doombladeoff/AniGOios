import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function CharactersLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="characters"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Персонажи',
                    title: 'Персонажи',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen name="[id]"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Персонаж',
                    title: 'Персонаж',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
        </Stack>
    )
}