import { Header } from "@/components/Screens/Profile/Header";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { UpdateUseranme } from "@/lib/firebase/update-username";
import { useAvatarUser } from "@/lib/firebase/user-images/uploadImages";
import { useUserStore } from "@/store/userStore";
import { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface EditProfileProp {
    show: boolean;
    onClose: (v: boolean) => void;
}

const { width } = Dimensions.get("screen");

export const EditProfile = ({ show, onClose }: EditProfileProp) => {
    const user = useUserStore((s) => s.user);

    const [textValue, setTextValue] = useState(user?.displayName ?? "");
    const [showToast, setShowToast] = useState(false);

    const toastOpacity = useRef(new Animated.Value(0)).current;

    if (!user) return null;

    const { pickImage, isLoadImage, progress } = useAvatarUser();
    const handlePickImage = useCallback((type: 'avatar' | 'banner') => {
        pickImage(type);
    }, [pickImage]);

    const handleSave = async () => {
        if (textValue.trim().length < 1) return;
        Keyboard.dismiss();
        await UpdateUseranme(user.uid, textValue.trim());

        setShowToast(true);
        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowToast(false));
        }, 5000);
    };

    return (
        <Modal
            presentationStyle="pageSheet"
            visible={show}
            onRequestClose={() => onClose(false)}
            animationType="slide"
        >
            <View style={{ flex: 1, backgroundColor: "#1c1c1e" }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 14,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(255,255,255,0.1)",
                    }}
                >
                    <Pressable
                        onPress={() => onClose(false)}
                        style={{ paddingHorizontal: 16 }}
                    >
                        <IconSymbol name="xmark" size={20} color="white" />
                    </Pressable>

                    <View
                        style={{
                            position: "absolute",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Изменить профиль
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View style={{ flex: 1, padding: 20 }}>
                    <Header
                        useAnimation={false}
                        bannerStyle={{
                            width: "100%",
                            height: 140,
                            borderRadius: 14,
                            backgroundColor: "black",
                        }}
                        avatarContainer={[
                            {
                                position: "absolute",
                                alignSelf: "center",
                                top: 120 / 1.75,
                                backgroundColor: "black",
                                padding: 8,
                                borderRadius: 20,
                            },
                        ]}
                        avatarStyle={{
                            width: 100,
                            height: 100,
                            borderRadius: 14,
                            padding: 0,
                            backgroundColor: "black",
                        }}
                    />

                    {/* Avatar & Banner buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                            marginTop: 64,
                        }}
                    >
                        <Pressable
                            onPress={() => handlePickImage('avatar')}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: "#0A84FF",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Изменить аватар
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handlePickImage('banner')}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: "#0A84FF",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Изменить баннер
                            </Text>
                        </Pressable>
                    </View>

                    {/* Input */}
                    <View style={{ paddingTop: 60 }}>
                        <Text
                            style={{
                                color: "white",
                                marginBottom: 8,
                                fontSize: 14,
                                fontWeight: "500",
                            }}
                        >
                            Имя профиля
                        </Text>

                        <TextInput
                            placeholderTextColor={"gray"}
                            placeholder="Nickname"
                            value={textValue}
                            onChangeText={setTextValue}
                            style={{
                                width: "100%",
                                backgroundColor: "rgba(255,255,255,0.08)",
                                padding: 14,
                                borderRadius: 12,
                                color: "white",
                                fontSize: 16,
                            }}
                        />
                    </View>

                    {/* Save button */}
                    <Pressable
                        onPress={handleSave}
                        style={{
                            paddingVertical: 14,
                            borderRadius: 12,
                            backgroundColor: "#0A84FF",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 24,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Сохранить
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Toast */}
            {showToast && (
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 40,
                        left: 20,
                        right: 20,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        padding: 16,
                        borderRadius: 12,
                        alignItems: "center",
                        opacity: toastOpacity,
                        transform: [
                            {
                                translateY: toastOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                        ],
                    }}
                >
                    <Text style={{ color: "white", fontSize: 15 }}>
                        Имя успешно обновлено ✅
                    </Text>
                </Animated.View>
            )}
        </Modal>
    );
};
