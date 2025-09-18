import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import SvgHandwriting from "@/components/other /Path/AnimPath";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useUserStore } from "@/store/userStore";
import { storage } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthScreen() {
    const setUser = useUserStore(s => s.setUser)
    const insets = useSafeAreaInsets();
    const { promptAsync } = useGoogleAuth();

    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
            <Animated.View style={[styles.inner, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => {
                        setUser(null);
                        storage.setSkip(true);
                        router.replace({ pathname: "/(tabs)/(home)/home" });
                    }}
                    hitSlop={10}
                    activeOpacity={0.8}
                    style={styles.skipButtonContainer}
                >
                    <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>

                <SvgHandwriting />
                <View style={styles.socialButtonsContainer}>
                    {["google", "apple"].map((icon, i) => (
                        <TouchableOpacity
                            key={icon}
                            style={[styles.socialButton, i === 0 && styles.marginRight]}
                            onPress={() => promptAsync()}
                        >
                            <FontAwesome6 name={icon} size={26 + (icon === "apple" ? 2 : 0)}
                                color="white" />
                        </TouchableOpacity>
                    ))}
                </View>

            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    flex: {
        flex: 1
    },
    background: {
        flex: 1,
        zIndex: -2
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20
    },
    skipButtonContainer: {
        alignSelf: "flex-end",
        marginTop: 10
    },
    skipButtonText: {
        fontSize: 18,
        color: 'white'
    },
    title: {
        fontSize: 42,
        marginBottom: 20,
        color: "white",
        fontWeight: "bold"
    },
    formContainer: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "white",
        shadowColor: "white",
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 }
    },
    loginButton: {
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        flexDirection: "row",
        gap: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "white",
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 }
    },
    loginText: {
        color: "black",
        fontWeight: "600"
    },
    errorText: {
        color: "red",
        paddingTop: 10
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        alignSelf: "center"
    },
    orLine: {
        borderWidth: 1,
        borderRadius: 25,
        width: 115,
        borderColor: "white",
        height: 1
    },
    orText: {
        color: "white",
        marginHorizontal: 10
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    socialButton: {
        backgroundColor: "rgba(89,88,88,0.8)",
        padding: 10,
        borderRadius: 100,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    marginRight: {
        marginRight: 10
    },
    registerFooter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        gap: 10,
    }
});
