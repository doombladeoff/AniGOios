import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { useUserStore } from "@/store/userStore";
import { storage } from "@/utils/storage";
import { Button, Host } from "@expo/ui/swift-ui";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
    const setUser = useUserStore((s) => s.setUser);

    return (
        <Stack screenOptions={{
            headerTransparent: true,
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <HeaderBackButton />,
            headerRight: () => (
                <Host style={{ width: 100, height: 25 }}>
                    <Button
                        onPress={() => {
                            setUser(null);
                            storage.setSkip(true);
                            router.replace({ pathname: "/(tabs)/(home)/home" });
                        }}
                        role="default"
                        color="white"
                    >
                        Пропустить
                    </Button>
                </Host>
            )
        }}>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='login' options={{ headerShown: true }} />
            <Stack.Screen name='register' options={{ headerShown: true }} />
            <Stack.Screen
                name="resetpass"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerRight: undefined
                }}
            />
        </Stack>
    )
}