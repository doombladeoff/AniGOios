import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{
            headerTransparent: true,
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <HeaderBackButton />,
        }}>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='login' options={{ headerShown: true }} />
            <Stack.Screen name='register' options={{ headerShown: true }} />
        </Stack>
    )
}