import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{
            headerLeft: () => <HeaderBackButton />
        }}>
            <Stack.Screen
                name="settings"
                options={{
                    headerTitle: 'Настройки',
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#1c1c1e' },
                }}
            />
            <Stack.Screen
                name="(edit)"
                options={{
                    headerShown: false,
                    headerTitle: '',
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerTransparent: true,
                }}
            />
        </Stack>
    )
}