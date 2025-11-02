import { DropdownMenu } from "@/components/ContextComponent";
import { DynamicStatusBar } from "@/components/DynamicStatusBar";
import { Divider } from "@/components/ui/Divider";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { verifyEmail } from "@/lib/firebase/authService";
import { UpdateUsername } from "@/lib/firebase/update-username";
import { useAvatarUser } from "@/lib/firebase/user-images/uploadImages";
import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    TextInput,
    View
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
    Extrapolation,
    FadeIn,
    FadeOut,
    interpolate,
    SlideInDown,
    SlideInUp,
    SlideOutDown,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

const isValidName = (name: string) => {
    if (!name.trim()) return false;

    const withoutEmojis = name.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g,
        ""
    );

    return /[A-Za-zА-Яа-яЁё0-9]/.test(withoutEmojis);
};

export default function ProfileEditScreen() {
    const isDarkMode = useTheme().theme === "dark";
    const user = useUserStore((s) => s.user);

    const [name, setName] = useState(user?.displayName || '');
    const [status, setStatus] = useState(user?.status || '');
    const [showLoader, setShowLoader] = useState(false);
    const {
        pickImage,
        saveChanges,
        hasPendingChanges,
        pendingChanges,
    } = useAvatarUser();

    const [editPasswordMode, setEditPasswordMode] = useState(false);
    const [pass, setPass] = useState({
        password: '',
        confirmPassword: '',
    });

    const hasPassword = !!user?.providerData.find(
        (provider) => provider.providerId === "password"
    );

    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const bannerAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [-150, 0], [1.4, 1], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [-150, 0, 200], [-50, 0, 100], Extrapolation.CLAMP);
        return {
            transform: [{ scale }, { translateY }],
        };
    });

    const avatarAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, 150], [0, -40], Extrapolation.CLAMP);
        const scale = interpolate(scrollY.value, [0, 150], [1, 0.8], Extrapolation.CLAMP);
        return {
            transform: [{ translateY }, { scale }],
        };
    });

    if (!user) return;

    const handleVerifyEmail = () => verifyEmail();
    const handleAddPassword = () => setEditPasswordMode(true);
    const handleSaveChanges = async () => {
        if (showLoader) return;

        const trimmedName = name.trim();
        if (!isValidName(trimmedName)) {
            Alert.alert("Ошибка", "Имя не может быть пустым или состоять только из эмодзи");
            return;
        }

        const changedFields: string[] = [];

        if (trimmedName !== (user?.displayName?.trim() || '')) {
            changedFields.push('name');
        }

        if (hasPendingChanges) {
            changedFields.push('images');
        }

        if (changedFields.length === 0) {
            Alert.alert('Профиль', 'Изменений не обнаружено');
            return;
        }

        console.log('Изменения:', changedFields);
        setShowLoader(true);

        try {
            if (changedFields.includes('name')) {
                await UpdateUsername(user?.uid, trimmedName);
                console.log('Имя обновлено на:', trimmedName);
            }

            if (changedFields.includes('images')) {
                await saveChanges();
                console.log('Изображения успешно сохранены');
            }

            await new Promise(resolve => setTimeout(resolve, 800));
            Alert.alert('Профиль', 'Изменения успешно сохранены ✅');
        } catch (error: any) {
            console.error('Ошибка при сохранении профиля:', error);
            Alert.alert('Ошибка', error?.message || 'Не удалось сохранить изменения 😞');
            setShowLoader(false);
            return;
        }

        setShowLoader(false);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    unstable_headerRightItems: () => [
                        {
                            type: 'button',
                            label: 'Сохранить',
                            onPress: () => handleSaveChanges(),
                        },
                        {
                            type: 'menu',
                            label: 'Изменить аватар/баннер',
                            icon: {
                                type: 'sfSymbol',
                                name: 'camera.fill',
                            },
                            menu: {
                                title: 'Фото профиля',
                                items: [
                                    {
                                        type: 'action',
                                        icon: {
                                            type: 'sfSymbol',
                                            name: 'photo',
                                        },
                                        label: 'Аватар',
                                        onPress: () => pickImage('avatar'),
                                    },
                                    {
                                        type: 'action',
                                        icon: {
                                            type: 'sfSymbol',
                                            name: 'photo',
                                        },
                                        label: 'Баннер',
                                        onPress: () => pickImage('banner'),
                                    }
                                ]
                            }
                        }
                    ]
                }}
            />
            <ThemedView darkColor="#0C0C0E" lightColor="#F8F8FA" style={{ flex: 1 }}>
                <DynamicStatusBar uri={user?.bannerURL} />
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 50 }}
                >
                    <View style={{ overflow: "hidden", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        <Animated.View style={[{ width: "100%", height: 220 }, bannerAnimatedStyle]}>
                            <Image
                                source={
                                    (user?.bannerURL || pendingChanges.bannerUri)
                                        ? { uri: pendingChanges.bannerUri || user.bannerURL }
                                        : require("@/assets/banners/1.jpg")
                                }
                                style={{ width: "100%", height: "100%" }}
                                contentFit="cover"
                            />
                        </Animated.View>

                        {__DEV__ && (
                            <View
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    bottom: 15,
                                    backgroundColor: "rgba(0,0,0,0.45)",
                                    borderRadius: 50,
                                    padding: 8,
                                }}
                            >
                                <DropdownMenu
                                    triggerItem={
                                        <Pressable>
                                            <Ionicons name="camera" size={22} color="white" />
                                        </Pressable>
                                    }
                                    items={[
                                        { title: "Сменить аватар" },
                                        { title: "Сменить баннер" },
                                    ]}
                                />
                            </View>
                        )}
                    </View>

                    <View style={{ alignItems: "center", marginTop: -60 }}>
                        <Animated.View style={[avatarAnimatedStyle, {
                            shadowColor: "#ff5fd2",
                            shadowOpacity: 0.5,
                            shadowRadius: 12,
                        }]}>
                            <Image
                                source={{ uri: pendingChanges.avatarUri || user?.avatarURL || user?.photoURL || "" }}
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 60,
                                    borderWidth: 3,
                                    backgroundColor: "#ccc",
                                    borderColor: "#ff5fd2",
                                    shadowColor: "#ff5fd2",
                                    shadowOpacity: 0.5,
                                    shadowRadius: 12,
                                }}
                            />
                        </Animated.View>
                    </View>

                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                        <View
                            style={{
                                backgroundColor: isDarkMode ? "#1C1C1E" : "white",
                                borderRadius: 16,
                                padding: 16,
                                shadowColor: "#000",
                                shadowOpacity: 0.05,
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 10,
                                gap: 16,
                            }}
                        >
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ThemedText
                                        lightColor="#8E8E93"
                                        darkColor="#8E8E93"
                                        style={{ fontSize: 13, marginBottom: 6 }}
                                    >
                                        Имя пользователя
                                    </ThemedText>
                                    <View style={{ flexDirection: "row", position: 'absolute', right: 14, zIndex: 1 }}>
                                        <ThemedText lightColor="#999" darkColor="#555" style={{ fontSize: 12 }}>
                                            {name.length}/15
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
                                    <TextInput
                                        value={name}
                                        placeholder="Никнейм"
                                        placeholderTextColor={isDarkMode ? "#555" : "#999"}
                                        onChangeText={setName}
                                        maxLength={15}
                                        style={{
                                            color: isDarkMode ? "white" : "black",
                                            fontSize: 16,
                                            paddingVertical: 6,
                                            zIndex: 0,
                                            paddingRight: 50,
                                            width: '100%'
                                        }}
                                    />
                                    {name.length > 0 && (
                                        <Pressable
                                            onPress={() => setName('')}
                                            style={{ position: 'absolute', right: 14, zIndex: 1 }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="gray" />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ThemedText
                                        lightColor="#8E8E93"
                                        darkColor="#8E8E93"
                                        style={{ fontSize: 13, marginBottom: 6 }}
                                    >
                                        Статус
                                    </ThemedText>
                                    <View style={{ flexDirection: "row", position: 'absolute', right: 14, zIndex: 1 }}>
                                        <ThemedText lightColor="#999" darkColor="#555" style={{ fontSize: 12 }}>
                                            {status.length}/50
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
                                    <TextInput
                                        value={status}
                                        placeholder="«Люблю аниме и кофе»"
                                        placeholderTextColor={isDarkMode ? "#555" : "#999"}
                                        maxLength={50}
                                        onChangeText={setStatus}
                                        style={{
                                            color: isDarkMode ? "white" : "black",
                                            fontSize: 16,
                                            paddingVertical: 6,
                                            zIndex: 0,
                                            paddingRight: 50,
                                            width: '100%'
                                        }}
                                    />

                                    {status.length > 0 && (
                                        <Pressable
                                            onPress={() => setStatus('')}
                                            style={{ position: 'absolute', right: 14, zIndex: 1 }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="gray" />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                            <Divider />
                            <View>
                                <ThemedText
                                    lightColor="#8E8E93"
                                    darkColor="#8E8E93"
                                    style={{ fontSize: 13, marginBottom: 6 }}
                                >
                                    Email
                                </ThemedText>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ThemedText lightColor="#999" darkColor="#555">
                                        {user?.email}
                                    </ThemedText>
                                    {user?.emailVerified && (
                                        <Ionicons
                                            name={'checkmark-circle-outline'}
                                            size={22}
                                            color={'lightgreen'}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 20, marginTop: 30, gap: 12 }}>
                        {hasPassword && (
                            <ActionItem
                                title="Изменить пароль"
                                icon="lock-closed-outline"
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {(!hasPassword || __DEV__) && (
                            <ActionItem
                                title="Добавить пароль"
                                icon="lock-open-outline"
                                isDarkMode={isDarkMode}
                                onPress={handleAddPassword}
                            />
                        )}

                        {(user?.emailVerified || __DEV__) && (
                            <ActionItem
                                title="Почта подтверждена"
                                icon="checkmark-circle-outline"
                                iconColor="lightgreen"
                                disabled
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {(!user?.emailVerified || __DEV__) && (
                            <ActionItem
                                title="Подтвердить почту"
                                icon="mail-outline"
                                isDarkMode={isDarkMode}
                                onPress={handleVerifyEmail}
                            />
                        )}
                    </View>
                </Animated.ScrollView>

                <PasswordModal
                    visible={editPasswordMode}
                    onClose={() => setEditPasswordMode(false)}
                    onSave={(p, c) => {
                        // TODO: валидация и сохранение
                        console.log("Пароль:", p, "Подтверждение:", c);

                        if (p === c) {
                            console.log("Пароль установлен");
                            setEditPasswordMode(false);
                        }
                    }}
                />

                {false && (
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        style={{
                            position: 'absolute',
                            zIndex: 10000,
                            width: '100%',
                            height: '100%',
                            alignSelf: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Animated.View entering={SlideInDown} style={{ backgroundColor: isDarkMode ? '#1C1C1E' : 'white', borderRadius: 20, padding: 20, width: '100%' }}>
                                <Pressable onPress={() => setEditPasswordMode(false)}>
                                    <Ionicons name="close" size={24} color="black" />
                                </Pressable>
                                <TextInput
                                    passwordRules={'required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8'}
                                    placeholder="Пароль"
                                    value={pass.password}
                                    onChangeText={(e) => { }}
                                />
                                <TextInput
                                    passwordRules={'required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8'}
                                    placeholder="Повторите пароль"
                                    value={pass.confirmPassword}
                                    onChangeText={(e) => { }}
                                />
                            </Animated.View>
                        </View>
                    </Animated.View>
                )}
                {showLoader && (
                    <Animated.View style={{ position: 'absolute', width: "100%", height: '100%', zIndex: 99, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={'small'} />
                    </Animated.View>
                )}
            </ThemedView>
        </>
    );
};

function ActionItem({
    title,
    icon,
    iconColor,
    disabled,
    isDarkMode,
    onPress,
}: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    disabled?: boolean;
    isDarkMode: boolean;
    onPress?: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDarkMode ? "#1C1C1E" : "white",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 18,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 6,
                opacity: disabled ? 0.6 : pressed ? 0.7 : 1,
            })}
        >
            <ThemedText
                darkColor="white"
                lightColor="#2C2C2E"
                style={{ fontSize: 16 }}
            >
                {title}
            </ThemedText>
            <Ionicons
                name={icon}
                size={22}
                color={iconColor || (isDarkMode ? "white" : "#6E5ACD")}
            />
        </Pressable>
    );
}

function PasswordModal({
    visible,
    onClose,
    onSave,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (pass: string, confirm: string) => void;
}) {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm: false,
    });

    const handleClose = () => {
        onClose();
        setShowPassword({ password: false, confirm: false });
        setPassword('');
        setConfirm('');
        setFocused(null);
    };

    if (!visible) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(180)}
            style={{
                position: "absolute",
                zIndex: 9999,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <BlurView
                intensity={50}
                tint={isDarkMode ? "dark" : "light"}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={10}
                style={{ width: "100%", alignItems: "center" }}
            >
                <Animated.View
                    entering={SlideInUp.springify()}
                    exiting={SlideOutDown}
                    style={{
                        width: "88%",
                        backgroundColor: isDarkMode ? "#1C1C1E" : "white",
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 8 },
                        shadowRadius: 20,
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                        <ThemedText
                            darkColor="white"
                            lightColor="black"
                            style={{ fontSize: 18, fontWeight: "600" }}
                        >
                            Установка пароля
                        </ThemedText>

                        <Pressable onPress={handleClose}>
                            <Ionicons
                                name="close-outline"
                                size={26}
                                color={isDarkMode ? "#ccc" : "#444"}
                            />
                        </Pressable>
                    </View>

                    {/* Поле пароля */}
                    <View style={{ marginBottom: 14 }}>
                        <ThemedText
                            lightColor="#8E8E93"
                            darkColor="#8E8E93"
                            style={{ fontSize: 13, marginBottom: 6 }}
                        >
                            Новый пароль
                        </ThemedText>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput
                                secureTextEntry={!showPassword.password}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Введите пароль"
                                placeholderTextColor={isDarkMode ? "#666" : "#aaa"}
                                onFocus={() => setFocused("password")}
                                onBlur={() => setFocused(null)}
                                style={{
                                    color: isDarkMode ? "white" : "black",
                                    fontSize: 16,
                                    borderWidth: 1.2,
                                    borderColor:
                                        focused === "password"
                                            ? "#A493F6"
                                            : isDarkMode
                                                ? "#2C2C2E"
                                                : "#E0E0E0",
                                    borderRadius: 12,
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    backgroundColor: isDarkMode ? "#2C2C2E" : "#F9F9F9",
                                    zIndex: 0,
                                    width: '100%',
                                    paddingRight: 50
                                }}
                            />
                            <Pressable onPress={() => setShowPassword(prev => ({ ...prev, password: !showPassword.password }))} style={{ position: 'absolute', right: 14, padding: 6, zIndex: 1 }}>
                                <Ionicons name={showPassword.password ? "eye" : "eye-off"} size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Подтверждение */}
                    <View style={{ marginBottom: 24 }}>
                        <ThemedText
                            lightColor="#8E8E93"
                            darkColor="#8E8E93"
                            style={{ fontSize: 13, marginBottom: 6 }}
                        >
                            Подтвердите пароль
                        </ThemedText>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput
                                secureTextEntry={!showPassword.confirm}
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Повторите пароль"
                                placeholderTextColor={isDarkMode ? "#666" : "#aaa"}
                                onFocus={() => setFocused("confirm")}
                                onBlur={() => setFocused(null)}
                                style={{
                                    color: isDarkMode ? "white" : "black",
                                    fontSize: 16,
                                    borderWidth: 1.2,
                                    borderColor:
                                        focused === "confirm"
                                            ? "#A493F6"
                                            : isDarkMode
                                                ? "#2C2C2E"
                                                : "#E0E0E0",
                                    borderRadius: 12,
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    backgroundColor: isDarkMode ? "#2C2C2E" : "#F9F9F9",
                                    zIndex: 0,
                                    width: '100%',
                                    paddingRight: 50
                                }}
                            />
                            <Pressable onPress={() => setShowPassword(prev => ({ ...prev, confirm: !showPassword.confirm }))} style={{ position: 'absolute', right: 14, padding: 6, zIndex: 1 }}>
                                <Ionicons name={showPassword.confirm ? "eye" : "eye-off"} size={24} color="white" />
                            </Pressable>
                        </View>

                    </View>

                    {/* Кнопки */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 12,
                        }}
                    >
                        <Pressable
                            onPress={handleClose}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: isDarkMode ? "#2C2C2E" : "#EDEDED",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText
                                darkColor="#ccc"
                                lightColor="#444"
                                style={{ fontSize: 15, fontWeight: "500" }}
                            >
                                Отмена
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            onPress={() => onSave(password, confirm)}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: "#A493F6",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText
                                darkColor="white"
                                lightColor="white"
                                style={{ fontSize: 15, fontWeight: "600" }}
                            >
                                Сохранить
                            </ThemedText>
                        </Pressable>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
};