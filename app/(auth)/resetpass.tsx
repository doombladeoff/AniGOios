import { ResetPassForm } from "@/components/Screens/Auth/ResetPassForm";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";

export default function ResetPasswordScreen() {
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#141e30", "#243b55"]}
                style={StyleSheet.absoluteFillObject}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, { paddingTop: useHeaderHeight() + 60, paddingHorizontal: 20, gap: 20 }]}>
                    <Text style={styles.title}>Сброс пароля</Text>
                    <Text style={[styles.title, { fontSize: 14, fontWeight: '500', maxWidth: '90%' }]}>Введите почту чтобы получить ссылку на сброс пароля.</Text>
                    <ResetPassForm />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "lightgray",
        textAlign: "center",
        marginBottom: 30,
    },
});
