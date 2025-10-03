import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { FontAwesome6 } from "@expo/vector-icons";
import { GlassContainer, GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.toLowerCase());
};

export const RegisterForm = () => {
    const { register } = useGoogleAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await register(data.name, data.email, data.password);
        } catch (err: any) {
            switch (err.code) {
                case "auth/email-already-in-use":
                    setError("email", { type: "manual", message: "Email уже используется" });
                    break;
                case "auth/invalid-email":
                    setError("email", { type: "manual", message: "Некорректный email" });
                    break;
                case "auth/invalid-credential":
                    setError("password", { type: "manual", message: "Неверный email или пароль" });
                    break;
                default:
                    setError("email", { type: "manual", message: "Ошибка входа, попробуйте снова" });
            }
        }
    };

    const passwordValue = watch("password");

    return (
        <GlassContainer style={styles.form}>

            <Controller
                name="name"
                control={control}
                rules={{
                    required: "Укажите имя",
                }}
                render={({ field: { onChange, value } }) => (
                    <Animated.View entering={FadeIn.delay(150)}>
                        <GlassView
                            isInteractive
                            style={[
                                styles.inputWrapper,
                                !isLiquidGlassAvailable() && { backgroundColor: "rgba(90,90,90,0.75)" },
                            ]}
                        >
                            <FontAwesome6 name="user" size={18} color="gray" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Имя"
                                placeholderTextColor={"gray"}
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                            />
                        </GlassView>
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                    </Animated.View>
                )}
            />

            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Укажите email",
                    validate: (v) => isValidEmail(v) || "Введите корректный email",
                }}
                render={({ field: { onChange, value } }) => (
                    <Animated.View entering={FadeIn.delay(150)}>
                        <GlassView
                            isInteractive
                            style={[
                                styles.inputWrapper,
                                !isLiquidGlassAvailable() && { backgroundColor: "rgba(90,90,90,0.75)" },
                            ]}
                        >
                            <FontAwesome6 name="envelope" size={18} color="gray" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={"gray"}
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </GlassView>
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </Animated.View>
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{
                    required: "Пароль обязателен",
                    minLength: { value: 6, message: "Минимум 6 символов" },
                    validate: (value) => {
                        const hasUpperCase = /[A-Z]/.test(value);
                        const hasNumber = /\d/.test(value);
                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                        if (!hasUpperCase) return "Добавьте хотя бы одну заглавную букву";
                        if (!hasNumber) return "Добавьте хотя бы одну цифру";
                        if (!hasSpecialChar) return "Добавьте хотя бы один спецсимвол";
                        return true;
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <View>
                        <GlassView
                            isInteractive
                            style={[
                                styles.inputWrapper,
                                !isLiquidGlassAvailable() && { backgroundColor: "rgba(90,90,90,0.75)" },
                            ]}
                        >
                            <FontAwesome6 name="lock" size={18} color="gray" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Пароль"
                                placeholderTextColor={"gray"}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                            />
                            <Pressable onPress={() => setShowPassword((p) => !p)}>
                                <IconSymbol
                                    name={showPassword ? "eye.fill" : "eye.slash.fill"}
                                    size={24}
                                    color={"white"}
                                />
                            </Pressable>
                        </GlassView>
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>
                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                    required: "Подтвердите пароль",
                    validate: (value) =>
                        value === passwordValue || "Пароли не совпадают",
                }}
                render={({ field: { onChange, value } }) => (
                    <View>
                        <GlassView
                            isInteractive
                            style={[
                                styles.inputWrapper,
                                !isLiquidGlassAvailable() && { backgroundColor: "rgba(90,90,90,0.75)" },
                            ]}
                        >
                            <FontAwesome6 name="lock" size={18} color="gray" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Повторите пароль"
                                placeholderTextColor={"gray"}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                            />
                            <Pressable onPress={() => setShowPassword((p) => !p)}>
                                <IconSymbol
                                    name={showPassword ? "eye.fill" : "eye.slash.fill"}
                                    size={24}
                                    color={"white"}
                                />
                            </Pressable>
                        </GlassView>
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                        )}
                    </View>
                )}
            />

            <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <View style={styles.loginButton}>
                    {isSubmitting ? (
                        <ActivityIndicator size={"small"} color={"white"} />
                    ) : (
                        <Text style={styles.loginText}>Зарегистрироваться</Text>
                    )}
                </View>
            </Pressable>
        </GlassContainer>
    );
};

const styles = StyleSheet.create({
    form: {
        gap: 15,

    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 12,
        shadowColor: "black",
        shadowRadius: 6,
        shadowOpacity: 0.55,
        shadowOffset: { width: 0, height: 2 },
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 54,
        color: "white",
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#4facfe",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "red",
        marginLeft: 4,
        fontSize: 13,
        fontWeight: "500",
        marginTop: 4,
    },
});
