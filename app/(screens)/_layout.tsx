
import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";
import { Platform } from "react-native";

const isIOS26 = Platform.Version >= "26.0";

export default function ScreensLayout() {
    return (
        <Stack screenOptions={{
            headerLeft: () => <HeaderBackButton />,
        }}>
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
            <Stack.Screen
                name="folder"
                options={{
                    ...(isIOS26 && { headerTransparent: true })
                }}
            />
        </Stack>
    )
}