import { LogInForm } from "@/components/Screens/Auth/LogInForm";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { auth } from "@/lib/firebase";
import { FontAwesome6 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import {
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, { FadeIn } from "react-native-reanimated";


export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Письмо для сброса пароля отправлено на " + email };
    } catch (error: any) {
        let message = "Ошибка при сбросе пароля";

        switch (error.code) {
            case "auth/invalid-email":
                message = "Некорректный email";
                break;
            case "auth/user-not-found":
                message = "Пользователь с таким email не найден";
                break;
            default:
                message = error.message;
        }

        return { success: false, message };
    }
};

export default function AuthScreen() {
    const { promptAsync } = useGoogleAuth();

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('@/assets/images/loginBackground.jpeg')} style={{ flex: 1 }} blurRadius={10}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: undefined,
                    }}
                />
                <LinearGradient
                    colors={["#141e30", "#243b55"]}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.2 }]}
                />

                <Animated.View
                    entering={FadeIn.duration(600)}
                    style={styles.container}
                >
                    <View style={{ zIndex: 1, shadowColor: 'black', shadowRadius: 6, shadowOpacity: 0.65, shadowOffset: { width: 0, height: 2 }, position: 'static' }}>
                        <Text style={styles.title}>Добро пожаловать 👋</Text>
                        <Text style={styles.subtitle}>Войдите в аккаунт</Text>
                    </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            style={{ width: "100%", paddingHorizontal: 20 }}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={10}
                        >
                            {isLiquidGlassAvailable() ? (
                                <GlassView glassEffectStyle="clear" style={{ gap: 15, padding: 20, borderRadius: 24 }}>
                                    <LogInForm />
                                </GlassView>
                            ) : (
                                <View style={{
                                    shadowColor: 'white',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 12
                                }}>
                                    <BlurView tint="regular" intensity={60} style={{ gap: 15, padding: 20, borderRadius: 24, overflow: 'hidden' }}>
                                        <LogInForm />
                                    </BlurView>
                                </View>
                            )}

                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                    <View style={styles.orContainer}>
                        <View style={styles.orLine} />
                        <Text style={styles.orText}>или</Text>
                        <View style={styles.orLine} />
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        {["google", "apple"].map((icon) => (
                            <Pressable key={icon} onPress={() => promptAsync()}>
                                <GlassView isInteractive glassEffectStyle="clear" style={styles.socialButton}>
                                    <FontAwesome6
                                        name={icon}
                                        size={26 + (icon === "apple" ? 2 : 0)}
                                        color="white"
                                    />
                                </GlassView>
                            </Pressable>
                        ))}
                    </View>

                    <View style={{ alignItems: 'center', gap: 10 }}>
                        <View style={styles.footer}>
                            <Text style={{ color: "white" }}>Нет аккаунта?</Text>

                            <Link href={{ pathname: "/(auth)/register" }} asChild>
                                <Pressable>
                                    <Text style={styles.footerLink}>Зарегистрируйтесь</Text>
                                </Pressable>
                            </Link>
                        </View>

                        <Link href={{ pathname: "/(auth)/resetpass" }} asChild>
                            <Pressable>
                                <Text style={styles.footerLink}>Забыли пароль?</Text>
                            </Pressable>
                        </Link>
                    </View>

                </Animated.View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "lightgray",
        textAlign: "center",
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: "#4facfe",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        justifyContent: "center",
    },
    orLine: {
        height: 1,
        width: 100,
        backgroundColor: "rgba(255,255,255,0.3)",
    },
    orText: {
        color: "lightgray",
        marginHorizontal: 10,
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
    },
    socialButton: {
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 12,
        borderRadius: 50,
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
    },
    footerLink: {
        color: "#4facfe",
        fontWeight: "600",
    },
});
