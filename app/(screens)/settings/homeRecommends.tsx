import { ItemsT } from "@/components/ContextComponent/DropdownMenu";
import { DynamicStatusBar } from "@/components/DynamicStatusBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
    loadRecommendationSettings,
    MinAge,
    RecommendationSettings,
    saveRecommendationSettings,
    Status,
    statusLabel,
    typeLabels,
    Types,
} from "@/utils/homeReccomendations/homeRecommendations";
import { storage } from "@/utils/storage";
import { HeaderButton, useHeaderHeight } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Switch, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut
} from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";

const START_YEAR = 1995;
const CURRENT_YEAR = new Date().getFullYear();

const minAgeItems = [
    { value: MinAge.PG, label: "PG" },
    { value: MinAge["PG-13"], label: "PG-13" },
    { value: MinAge["R-17"], label: "R-17" },
    { value: MinAge.R, label: "R" },
];
const statusItems: Status[] = ["released", "ongoing", "announce"] as const;
const typeItems: Types[] = ["tv", "movie", "shortfilm", "ova", "ona"] as const;

function isSettingsChanged(
    curr: RecommendationSettings,
    initialSettings: RecommendationSettings | null
): boolean {
    if (initialSettings == null) return false;
    return JSON.stringify(curr) !== JSON.stringify(initialSettings);
}

export default function EditRecommendationsScreen() {
    const initialSettings = loadRecommendationSettings();

    const [showRecs, setShowRecs] = useState(storage.getShowHomeRecs() ?? true);
    const [minRating, setMinRating] = useState<number>(7);
    const [minAge, setMinAge] = useState<MinAge[]>([
        MinAge["PG-13"],
        MinAge["R-17"],
        MinAge.R,
    ]);
    const [status, setStatus] = useState<Status[]>(["released", "ongoing"]);
    const [types, setTypes] = useState<Types[]>(["tv", "movie"]);
    const [years, setYears] = useState<{ year_from: number | null; year_to: number | null } | null>(null);

    const headerHeight = useHeaderHeight();

    const yearItem = useMemo(
        () =>
            Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => {
                const year = START_YEAR + i;
                return {
                    title: year.toString(),
                    onSelect: (type: "to" | "from") => {
                        setYears((prev) => {
                            if (!prev) {
                                return type === "to"
                                    ? { year_from: null, year_to: year }
                                    : { year_from: year, year_to: null };
                            }
                            if (type === "to") {
                                if (prev.year_from !== null && year < prev.year_from) {
                                    return { ...prev, year_to: null };
                                }
                                return { ...prev, year_to: year };
                            }
                            if (type === "from") {
                                if (prev.year_to !== null && year > prev.year_to) {
                                    return { ...prev, year_from: null };
                                }
                                return { ...prev, year_from: year };
                            }
                            return prev;
                        });
                    },
                };
            }),
        []
    );

    const ratingItems: ItemsT[] = Array.from({ length: 10 }, (_, i) => ({
        title: (i + 1).toString(),
        onSelect: () => setMinRating(i + 1),
    }));

    useEffect(() => {
        if (initialSettings) {
            setMinRating(initialSettings.minRating);
            setMinAge(initialSettings.minAge);
            setStatus(initialSettings.status);
            setTypes(initialSettings.types);
            setYears(initialSettings.years ?? null);
        }
    }, []);

    const handleSave = async () => {
        const curr = { minRating, minAge, status, types, years };
        await saveRecommendationSettings(curr).then(() =>
            Alert.alert("Рекомендации", "Настройки сохранены ✅")
        );
    };

    const renderCard = (
        label: string,
        trigger: React.ReactNode,
        content: React.ReactNode
    ) => (
        <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut}
        >
            <ThemedView
                darkColor="rgba(255,255,255,0.06)"
                lightColor="rgba(0,0,0,0.06)"
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                }}
            >
                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>{label}</ThemedText>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
                    <DropdownMenu.Content>{content}</DropdownMenu.Content>
                </DropdownMenu.Root>
            </ThemedView>
        </Animated.View>
    );

    return (
        <>
            <DynamicStatusBar />
            <Stack.Screen
                options={{
                    title: "Настройки рекомендаций",
                    headerLeft: () => (
                        <HeaderButton
                            onPress={() => {
                                const currSettings = { minRating, minAge, status, types, years };

                                if (isSettingsChanged(currSettings, initialSettings)) {
                                    Alert.alert(
                                        "Вы уверены?",
                                        "У вас есть несохранённые изменения. Хотите сохранить перед выходом?",
                                        [
                                            {
                                                text: "Сохранить",
                                                style: "default",
                                                onPress: async () => {
                                                    await handleSave();
                                                    router.back();
                                                },
                                            },
                                            {
                                                text: "Не сохранять",
                                                style: "destructive",
                                                onPress: () => router.back(),
                                            },
                                            { text: "Отмена", style: "cancel" },
                                        ]
                                    );
                                } else {
                                    router.back();
                                }
                            }}
                        >
                            <IconSymbol name="chevron.left" size={22} />
                        </HeaderButton>
                    ),
                    unstable_headerRightItems: () => [
                        {
                            type: "button",
                            label: "Сохранить",
                            onPress: handleSave,
                        },
                    ],
                }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: headerHeight + 10,
                    paddingBottom: 30,
                    gap: 14,
                    paddingHorizontal: 16,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10, marginBottom: 20 }}>
                    <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>Показывать рекомендации</ThemedText>
                    <Switch value={showRecs} onValueChange={setShowRecs} />
                </View>
                <View style={{ gap: 14, opacity: !showRecs ? 0.6 : 1 }} pointerEvents={!showRecs ? 'none' : 'auto'}>
                    {renderCard(
                        "Минимальный рейтинг",
                        <Trigger value={minRating.toString()} />,
                        ratingItems.map((a, index) => (
                            <DropdownMenu.CheckboxItem
                                key={'minrating'}
                                value={minRating === Number(a.title)}
                                onValueChange={a.onSelect}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{a.title}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}

                    {renderCard(
                        "Минимальный возраст",
                        <Trigger value={minAgeItems.filter(a => minAge.includes(a.value)).map(a => a.label).join(", ")} />,
                        minAgeItems.map((a) => (
                            <DropdownMenu.CheckboxItem
                                key={a.label}
                                value={minAge.includes(a.value)}
                                onValueChange={() => {
                                    if (!minAge.includes(a.value))
                                        setMinAge((prev) => [...prev, a.value]);
                                    else setMinAge((prev) => prev.filter((v) => v !== a.value));
                                }}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{a.label}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}

                    {renderCard(
                        "Статус",
                        <Trigger value={status.map((s) => statusLabel[s]).join(", ")} />,
                        statusItems.map((s) => (
                            <DropdownMenu.CheckboxItem
                                key={s}
                                value={status.includes(s)}
                                onValueChange={() => {
                                    if (!status.includes(s))
                                        setStatus((prev) => [...prev, s]);
                                    else setStatus((prev) => prev.filter((v) => v !== s));
                                }}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{statusLabel[s]}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}

                    {renderCard(
                        "Тип",
                        <Trigger value={types.map((t) => typeLabels[t]).join(", ")} />,
                        typeItems.map((t) => (
                            <DropdownMenu.CheckboxItem
                                key={t}
                                value={types.includes(t)}
                                onValueChange={() => {
                                    if (!types.includes(t))
                                        setTypes((prev) => [...prev, t]);
                                    else setTypes((prev) => prev.filter((v) => v !== t));
                                }}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{typeLabels[t]}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}

                    {renderCard(
                        "Начиная с",
                        <Trigger value={years?.year_from?.toString() ?? "Не указан"} />,
                        yearItem.map((a, index) => (
                            <DropdownMenu.CheckboxItem
                                key={'yearfrom'}
                                value={a.title === years?.year_from?.toString()}
                                onValueChange={() => a.onSelect("from")}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{a.title}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}

                    {renderCard(
                        "Заканчивая",
                        <Trigger value={years?.year_to?.toString() ?? "Не указан"} />,
                        yearItem.map((a, index) => (
                            <DropdownMenu.CheckboxItem
                                key={'yearto'}
                                value={a.title === years?.year_to?.toString()}
                                onValueChange={() => a.onSelect("to")}
                            >
                                <DropdownMenu.ItemIndicator />
                                <DropdownMenu.ItemTitle>{a.title}</DropdownMenu.ItemTitle>
                            </DropdownMenu.CheckboxItem>
                        ))
                    )}
                </View>
            </ScrollView>
        </>
    );
}

const Trigger = ({ value }: { value: string }) => (
    <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <ThemedText>{value}</ThemedText>
        <IconSymbol name="chevron.up.chevron.down" size={14} color="orange" />
    </Pressable>
);
