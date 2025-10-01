import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function CommentsLayout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTransparent: Platform.Version >= '26.0',
            headerLeft: () => <HeaderBackButton />
        }}>
            <Stack.Screen
                name="comments"
                options={{ title: "Комментарии" }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: "" }}
            />
        </Stack>
    )
}