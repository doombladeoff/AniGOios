import { RegisterForm } from "@/components/Screens/Auth/RegisterForm";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#141e30", "#243b55"]}
                style={StyleSheet.absoluteFillObject}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ width: "100%", paddingHorizontal: 0 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={22}
                >
                    <Text style={styles.title}>Регистрация</Text>

                    {isLiquidGlassAvailable() ? (
                        <GlassView glassEffectStyle="clear" style={styles.glassBlurContainer}>
                            <RegisterForm />
                        </GlassView>
                    ) : (
                        <View style={{
                            shadowColor: 'white',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.1,
                            shadowRadius: 12
                        }}>
                            <BlurView tint="regular" intensity={60} style={[styles.glassBlurContainer, { overflow: 'hidden' }]}>
                                <RegisterForm />
                            </BlurView>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent",
        gap: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        color: "white",
        fontWeight: "bold",
        marginBottom: 30,
    },
    glassBlurContainer: {
        gap: 15,
        padding: 20,
        borderRadius: 24
    }
});
