import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function EditSettingsScreen() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerLeft: () => <HeaderBackButton />,
            headerTitle: '',
        }}>
            <Stack.Screen
                name="homeRecommends"
                options={{
                    headerTransparent: true,
                    headerTitle: 'Рекомендации',
                    headerLeft: () => <HeaderBackButton />
                }}
            />
            <Stack.Screen
                name="posterEditor"
                options={{
                    headerTitle: 'Редактор постера',
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="editProfile"
                options={{
                    headerTitle: 'Профиль',
                    headerTitleAlign: 'center',
                    headerTransparent: true,
                    ...(Platform.Version < '26.0' && {
                        headerStyle: { backgroundColor: '#1c1c1e' },
                    }),
                }}
            />
        </Stack>
    )
}