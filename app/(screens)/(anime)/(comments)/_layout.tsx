import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function CommentsLayout() {
    return (
        <Stack screenOptions={{ headerShown: true, headerLeft: () => <HeaderBackButton /> }}>
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