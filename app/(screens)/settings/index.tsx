import { DropdownMenu } from "@/components/ContextComponent";
import { DynamicStatusBar } from "@/components/DynamicStatusBar";
import { Divider } from "@/components/ui/Divider";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemeMode, useTheme } from "@/hooks/ThemeContext";
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Pressable, ScrollView, Switch, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const quality = ['720', '480', '360'] as const;

export default function SettingsScreen() {
    const { mode, setMode } = useTheme();

    const [devMode, setDevMode] = useState(true);
    const [selectedQuality, setSelectedQuality] = useState<number>(Number(storage.getQuality()) || 0);

    const handleClearSettings = () => {
        Alert.alert(
            "Сброс настроек",
            "Вы уверены, что хотите сбросить все настройки приложения?",
            [
                {
                    text: "Отмена",
                    style: "cancel"
                },
                {
                    text: "Сбросить",
                    style: "destructive",
                    onPress: () => {
                        storage.clearALL();
                        setSelectedQuality(0);
                        setMode('system');
                        setDevMode(false);
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        auth.signOut();
        router.replace({ pathname: '/(auth)' })
    }

    return (
        <>
            <DynamicStatusBar />
            {auth.currentUser && (
                <Stack.Screen
                    options={{
                        unstable_headerRightItems: () => [
                            {
                                type: 'button',
                                tintColor: 'red',
                                label: 'Выйти',
                                icon: {
                                    type: 'sfSymbol',
                                    name: 'rectangle.portrait.and.arrow.right.fill',
                                },
                                onPress: () => handleLogout(),
                            }
                        ]
                    }}
                />
            )}
            <ScrollView contentInsetAdjustmentBehavior='automatic' contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'column', gap: 20 }}>
                    {auth.currentUser && (
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.04)' style={{ flex: 1, borderRadius: 28, justifyContent: 'center', padding: 20, paddingVertical: 16, gap: 20 }}>
                            <Pressable
                                onPress={() => router.push('/settings/editProfile')}
                                style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                                <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Редактировать профиль</ThemedText>
                                <IconSymbol name="chevron.right" size={16} />
                            </Pressable>
                        </ThemedView>
                    )}

                    <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.04)' style={{ flex: 1, borderRadius: 28, justifyContent: 'center', padding: 20, paddingVertical: 16, gap: 14 }}>
                        <Pressable
                            onPress={() => router.push('/settings/homeRecommends')}
                            style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                            <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Настройки рекомендаций</ThemedText>
                            <IconSymbol name="chevron.right" size={16} />
                        </Pressable>
                    </ThemedView>

                    <View style={{ gap: 10 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10, color: 'rgba(100,100,100,0.8)' }}>Плеер</ThemedText>
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.04)' style={{ flex: 1, borderRadius: 28, justifyContent: 'center', padding: 20, paddingVertical: 20, gap: 14 }}>
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                <ThemedText style={{ fontSize: 16 }}>Качество видео</ThemedText>
                                <DropdownMenu
                                    triggerItem={
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 4 }}>
                                            <ThemedText style={{ fontSize: 16, width: 50, textAlign: 'right' }}>
                                                {quality[selectedQuality]}p
                                            </ThemedText>
                                            <IconSymbol name="chevron.up.chevron.down" size={12} />
                                        </View>
                                    }
                                    items={quality.map((q, index) => (
                                        {
                                            title: `${q}p`,
                                            onSelect: () => {
                                                setSelectedQuality(index);
                                                storage.setQuality(index.toString());
                                            }
                                        }
                                    ))}
                                />
                            </View>
                            <Divider />
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>Пропускать опенинги</ThemedText>
                                <Switch value={false} />
                            </View>
                        </ThemedView>
                    </View>

                    <View style={{ gap: 10 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10, color: 'rgba(100,100,100,0.8)' }}>Тема</ThemedText>
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.04)' style={{ flex: 1, borderRadius: 28, justifyContent: 'center', padding: 20, gap: 14 }}>
                            {[
                                { value: 'light' as ThemeMode, label: 'Светлая' },
                                { value: 'dark' as ThemeMode, label: 'Тёмная' },
                                { value: 'system' as ThemeMode, label: 'Системная' },
                            ].map((opt, index) => (
                                <React.Fragment key={opt.value}>
                                    {(index > 0 && index < 3) && <Divider />}
                                    <Pressable onPress={() => setMode(opt.value)}
                                        style={({ pressed }) => ({
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            opacity: pressed ? 0.8 : 1,
                                        })}
                                    >
                                        <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>{opt.label}</ThemedText>
                                        {mode === opt.value ?
                                            <Animated.View entering={FadeIn}>
                                                <IconSymbol name="checkmark" size={16} />
                                            </Animated.View>
                                            : null}
                                    </Pressable>
                                </React.Fragment>
                            ))}
                        </ThemedView>
                    </View>

                    {(__DEV__ || devMode) && (
                        <View style={{ gap: 10 }}>
                            <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10, color: 'rgba(100,100,100,0.8)' }}>DEV</ThemedText>
                            <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.04)' style={{ flex: 1, borderRadius: 28, justifyContent: 'center', padding: 20, gap: 14 }}>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                    <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>Режим разработчика</ThemedText>
                                    <Switch value={devMode} disabled />
                                </View>
                                <Divider />
                                <Pressable
                                    onPress={() => {
                                        Alert.prompt(
                                            "Введите ID",
                                            'id - malID',
                                            [
                                                { text: 'Отмена', style: 'cancel' },
                                                {
                                                    text: "Перейти",
                                                    onPress: (v: any) => router.push({ pathname: '/(screens)/anime/[id]', params: { id: Number(v) } }),
                                                    style: 'default',
                                                }
                                            ],
                                            'plain-text',
                                            '',
                                            'numeric'
                                        );
                                    }}
                                    style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}
                                >
                                    <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Перейти к аниме по ID</ThemedText>
                                    <IconSymbol name="chevron.right" size={16} />
                                </Pressable>
                                <Divider />
                                <Pressable
                                    onPress={() => router.push('/settings/dev/dev-settings')}
                                    style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}
                                >
                                    <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>DEV</ThemedText>
                                    <IconSymbol name="chevron.right" size={16} />
                                </Pressable>
                            </ThemedView>
                        </View>
                    )}

                    <Button
                        title="Сбросить настройки"
                        onPress={handleClearSettings}
                        color={'red'}
                    />

                </View>
            </ScrollView>
        </>
    );
};