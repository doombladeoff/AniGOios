import HeaderBackButton from "@/components/ui/HeaderBackButton";
import { useUserStore } from "@/store/userStore";
import { Button, Host } from "@expo/ui/swift-ui";
import { Stack } from "expo-router";
import { useShallow } from "zustand/shallow";

export default function AuthLayout() {
    const { setSkipAuth, setUser } = useUserStore(
        useShallow((s) => ({
            setSkipAuth: s.setSkipAuth,
            setUser: s.setUser,
        }))
    );

    return (
        <Stack screenOptions={{
            headerTransparent: true,
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <HeaderBackButton color="white" />,
            headerRight: () => (
                <Host style={{ width: 100, height: 25 }}>
                    <Button
                        onPress={() => {
                            setUser(null);
                            setSkipAuth(true);
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