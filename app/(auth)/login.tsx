import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
    Keyboard,
    KeyboardAvoidingView, Platform, StyleSheet,
    TouchableWithoutFeedback
} from "react-native";
// import { LoginForm } from "@/components/Forms/LoginForm";
import { useLocalSearchParams } from "expo-router";

export default function LoginScreen() {
    const {email} = useLocalSearchParams();

    return (
        <ImageBackground source={""} style={{flex: 1}}>
            <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[
                    'transparent',
                    'rgba(0,0,0, 0.3)',
                    'rgba(0,0,0, 0.65)',
                    'rgba(0,0,0, 1)',
                ]}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView style={{flex: 1}}
                                          behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        {/* <LoginForm defaultEmail={email as string}/> */}
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </LinearGradient>
        </ImageBackground>
    )
}