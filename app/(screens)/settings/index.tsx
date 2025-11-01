import { DropdownMenu } from "@/components/ContextComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemeMode, useTheme } from "@/hooks/ThemeContext";
import { auth } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const Divider = () => {
    return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(100,100,100, 0.5)', width: '100%' }} />;
};

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

    return (
        <>
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
                                onPress: () => { }
                            }
                        ]
                    }}
                />
            )}
            <ScrollView contentInsetAdjustmentBehavior='automatic' contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'column', gap: 20 }}>
                    <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 20 }}>
                        <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                            <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Редактировать профиль</ThemedText>
                            <IconSymbol name="chevron.right" size={16} />
                        </Pressable>
                    </ThemedView>

                    <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 14 }}>
                        <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                            <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Настройки рекомендаций</ThemedText>
                            <IconSymbol name="chevron.right" size={16} />
                        </Pressable>
                    </ThemedView>

                    <View style={{ gap: 10 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10 }}>Плеер</ThemedText>
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 14 }}>
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                <ThemedText>Качество видео</ThemedText>
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
                        <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10 }}>Тема</ThemedText>
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 14 }}>
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
                            <ThemedText style={{ fontSize: 18, fontWeight: '700', paddingLeft: 10 }}>DEV</ThemedText>
                            <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 14 }}>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                    <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>Режим разработчика</ThemedText>
                                    <Switch value={devMode} disabled />
                                </View>
                                <Divider />
                                <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                                    <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Перейти к аниме по ID</ThemedText>
                                    <IconSymbol name="chevron.right" size={16} />
                                </Pressable>
                                <Divider />
                                <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
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