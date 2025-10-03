import { auth, db } from "@/lib/firebase";
import { FontAwesome6 } from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    return regex.test(email.toLowerCase());
};

const checkUserByEmail = async (email: string) => {
    try {
        const usersRef = collection(db, "user-collection");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty;
    } catch (error) {
        console.error("Ошибка при поиске пользователя:", error);
        return false;
    }
};

export const ResetPassForm = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { email: "" },
    });

    const resetPassword = async (email: string) => {
        console.log(email)

        const checkUser = await checkUserByEmail(email);
        if (checkUser) {
            await sendPasswordResetEmail(auth, email).then(() => Alert.alert("Восстановление пароля", "Письмо для сброса пароля отправлено на " + email, [{
                text: "Ок",
                style: 'default',
                onPress: router.back
            }]));
            return { success: true, message: "Письмо для сброса пароля отправлено на " + email };
        }
        else {
            setError("email", { type: "manual", message: "Пользователья с данным email не найден." });
            return { success: false, message: "Пользователья с данным email не найден." };
        }
    };
    return (
        <View style={{ gap: 20 }}>
            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Email обязателен",
                    validate: (v) => isValidEmail(v) || "Введите корректный email",
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
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                )}
            />
            <Pressable onPress={handleSubmit(({ email }) => resetPassword(email))}>
                <GlassView isInteractive glassEffectStyle="clear" style={styles.btn}>
                    {isSubmitting ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                        <Text style={styles.btnText}>Сбросить пароль</Text>
                    )}
                </GlassView>
            </Pressable>

            <Text style={styles.footerText}>Не забудьте проверить спам, т.к сообщение может быть там.</Text>
        </View>
    )
};

const styles = StyleSheet.create({
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
    btn: {
        backgroundColor: "#4facfe",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    btnText: {
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
    footerText: {
        fontSize: 14,
        color: 'gray',
        fontWeight: '400',
        maxWidth: '85%',
        textAlign: 'center',
        alignSelf: 'center'
    }
});
