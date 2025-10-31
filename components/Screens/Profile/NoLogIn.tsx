import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUserStore } from "@/store/userStore";
import { Pressable, Text, View } from "react-native";

export const NoLogIn = () => {
    const setSkipAuth = useUserStore(s => s.setSkipAuth);
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
                gap: 20
            }}
        >
            <Text
                style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: "600",
                    textAlign: "center",
                }}
            >
                Войдите в аккаунт
            </Text>

            <Pressable
                onPress={() => setSkipAuth(false)}
                style={({ pressed }) => [
                    {
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 16,
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        shadowColor: "#000",
                        shadowOpacity: pressed ? 0.15 : 0.25,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                    },
                ]}
            >
                <IconSymbol name="key.fill" size={22} color="black" />
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "black",
                    }}
                >
                    Войти
                </Text>
            </Pressable>

        </View>
    )
}