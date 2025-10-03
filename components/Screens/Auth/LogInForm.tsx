import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { FontAwesome6 } from "@expo/vector-icons";
import { GlassContainer, GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";

type FormValues = {
    email: string;
    password: string;
};

const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    return regex.test(email.toLowerCase());
};

const tailPath = "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z";

export const LogInForm = () => {
    const { login } = useGoogleAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await login(data.email, data.password);
        } catch (err: any) {
            switch (err.code) {
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

    return (
        <GlassContainer style={styles.form}>
            <View style={{ zIndex: 4, shadowColor: 'black', shadowOpacity: 0.45, shadowRadius: 6, flexDirection: 'row', }}>
                <Image source={require("@/assets/images/loginGirl.png")} style={{ width: 180, height: 140, top: 40 }} pointerEvents="none" />
                {(errors.email || errors.password) && <Animated.View key={errors.email?.message || errors.password?.message} entering={FadeInDown} exiting={FadeOut} style={{ paddingTop: 40, right: 25 }}>
                    <View>
                        <View style={{ maxWidth: moderateScale(250, 2), alignSelf: 'flex-start', paddingHorizontal: moderateScale(10, 2), paddingTop: moderateScale(5, 2), paddingBottom: moderateScale(7, 2), borderRadius: 20, marginVertical: moderateScale(7, 2), backgroundColor: 'white', }}>
                            <Text style={styles.errorText}>{errors.email?.message || errors.password?.message}</Text>
                        </View>
                        <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, flex: 1, }, styles.svgContainerOther]}>
                            <Svg width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5" enable-background="new 32.485 17.5 15.515 17.5">
                                <Path d={tailPath} fill={'white'} transform={[{ translateX: 0 }, { translateY: 0 }]} />
                            </Svg>
                        </View>
                    </View>
                </Animated.View>
                }
            </View>

            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Email обязателен",
                    validate: (v) => isValidEmail(v) || "Введите корректный email",
                }}
                render={({ field: { onChange, value } }) => (
                    <GlassView
                        isInteractive
                        style={[
                            styles.inputWrapper,
                            !isLiquidGlassAvailable() && { backgroundColor: "rgba(90,90,90,0.75)" },
                        ]}
                    >
                        <FontAwesome6 name="user" size={18} color="gray" style={styles.inputIcon} />
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
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{
                    required: "Пароль обязателен",
                    minLength: { value: 6, message: "Минимум 6 символов" },
                }}
                render={({ field: { onChange, value } }) => (
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
                )}
            />

            <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <View style={styles.loginButton}>
                    {isSubmitting ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                        <Text style={styles.loginText}>Войти</Text>
                    )}
                </View>
            </Pressable>
        </GlassContainer >
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
        maxWidth: 150,
        flexShrink: 1,
        minHeight: 50,
        fontSize: 14,
        fontWeight: '500'
    },
    bubble: {
        maxWidth: moderateScale(250, 2),
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,
        marginVertical: moderateScale(7, 2),
    },
    itemOut: {
        alignSelf: 'flex-end',
    },
    svgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        flex: 1
    },
    svgContainerOwn: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    svgContainerOther: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
});

