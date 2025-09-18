import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { Stack } from "expo-router";

export default function ExperementalLayout() {
    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: true, headerLeft: () => <HeaderBackButton /> }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="pages" />
            <Stack.Screen name="list" />
            <Stack.Screen name="recommendations" />
            {/* <Stack.Screen name="task" /> */}
        </Stack>
    )
}