import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

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
                    headerTitleAlign: 'center',
                    headerTransparent: true,
                }}
            />
        </Stack>
    )
}