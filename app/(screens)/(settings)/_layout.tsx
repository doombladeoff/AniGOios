import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";
import { Platform } from "react-native";

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
                    headerTransparent: true,
                    ...(Platform.Version < '26.0' && {
                        headerStyle: { backgroundColor: '#1c1c1e' },
                    }),
                }}
            />
            <Stack.Screen
                name="(edit)"
                options={{
                    headerShown: false,
                    headerTitle: '',
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                }}
            />
        </Stack>
    )
}