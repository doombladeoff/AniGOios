import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemeMode, useTheme } from "@/hooks/ThemeContext";
import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";

export default function SettingsScreen() {
    const { theme, mode, setMode } = useTheme();
    const isDarkMode = theme === 'dark';

    const [devMode, setDevMode] = useState(true);

    return (
        <>
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
            <ScrollView contentInsetAdjustmentBehavior='automatic' contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'column', gap: 20 }}>
                    <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 20 }}>
                        <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                            <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Редактировать профиль</ThemedText>
                            <IconSymbol name="chevron.right" size={16} />
                        </Pressable>
                    </ThemedView>

                    <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 20 }}>
                        <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                            <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Настройки рекомендаций</ThemedText>
                            <IconSymbol name="chevron.right" size={16} />
                        </Pressable>
                    </ThemedView>

                    <View style={{ gap: 10 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>Тема</ThemedText>
                        <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 20 }}>
                            {[
                                { value: 'light' as ThemeMode, label: 'Светлая' },
                                { value: 'dark' as ThemeMode, label: 'Тёмная' },
                                { value: 'system' as ThemeMode, label: 'Системная' },
                            ].map((opt) => (
                                <Pressable
                                    key={opt.value}
                                    onPress={() => setMode(opt.value)}
                                    style={({ pressed }) => ({
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 8,
                                        opacity: pressed ? 0.8 : 1,
                                    })}
                                >
                                    <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>{opt.label}</ThemedText>
                                    {mode === opt.value ? <IconSymbol name="checkmark" size={16} /> : null}
                                </Pressable>
                            ))}
                        </ThemedView>
                    </View>

                    {(__DEV__ || devMode) && (
                        <View style={{ gap: 10 }}>
                            <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>DEV</ThemedText>
                            <ThemedView darkColor='rgba(255,255,255,0.08)' lightColor='rgba(0,0,0,0.08)' style={{ flex: 1, borderRadius: 20, justifyContent: 'center', padding: 14, gap: 20 }}>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                    <ThemedText lightColor="black" darkColor='white' style={{ fontSize: 16 }}>Режим разработчика</ThemedText>
                                    <Switch value={devMode} disabled />
                                </View>

                                <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                                    <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>Перейти к аниме по ID</ThemedText>
                                    <IconSymbol name="chevron.right" size={16} />
                                </Pressable>

                                <Pressable style={({ pressed }) => ({ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: pressed ? 0.8 : 1 })}>
                                    <ThemedText lightColor='black' darkColor='white' style={{ fontSize: 16 }}>DEV</ThemedText>
                                    <IconSymbol name="chevron.right" size={16} />
                                </Pressable>
                            </ThemedView>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    );
};