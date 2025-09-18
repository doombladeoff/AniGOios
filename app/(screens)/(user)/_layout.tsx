import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function UserLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerTransparent: true, title: '' }} />
            <Stack.Screen
                name="friends"
                options={{ title: 'Друзья', headerLeft: () => <HeaderBackButton /> }}
            />
        </Stack>
    )
}