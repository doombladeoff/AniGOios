// import { DropdownMenu as DM } from "@/components/ContextComponent";
import { ItemsT } from "@/components/ContextComponent/DropdownMenu";
import { UIPage } from "@/components/Screens/Settings/Page";
import HeaderBackButton from "@/components/ui/HeaderBackButton";
// import { IconSymbol } from "@/components/ui/IconSymbol";
import { loadRecommendationSettings, MinAge, RecommendationSettings, saveRecommendationSettings, Status, statusLabel, typeLabels, Types } from "@/utils/homeReccomendations/homeRecommendations";
import { storage } from "@/utils/storage";
import { Button, ContextMenu, Host, HStack, Section, Spacer, Switch as UISwitch, Text as UIText } from "@expo/ui/swift-ui";
import { background, cornerRadius, frame, padding } from "@expo/ui/swift-ui/modifiers";
// import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
// import { Switch } from "react-native-gesture-handler";
// import * as DropdownMenu from "zeego/dropdown-menu";

// const useNativeUI = true;

const START_YEAR = 1995;
const CURRENT_YEAR = new Date().getFullYear();

function isSettingsChanged(curr: RecommendationSettings, initialSettings: RecommendationSettings | null): boolean {
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
    const [years, setYears] = useState<{ year_from: number | null, year_to: number | null } | null>(null);

    const yearItem: { title: string; onSelect: (type: "to" | "from") => void }[] = useMemo(() => {
        return Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => {
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
        });
    }, []);

    const ratingItems: ItemsT[] = Array.from({ length: 10 }, (_, i) => ({
        title: (i + 1).toString(),
        onSelect: () => setMinRating(i + 1),
    }));

    const minAgeItems = [
        { value: MinAge.PG, label: "PG" },
        { value: MinAge["PG-13"], label: "PG-13" },
        { value: MinAge["R-17"], label: "R-17" },
        { value: MinAge.R, label: "R" },
    ];
    const statusItems: Status[] = ["released", "ongoing", "announce"];
    const typeItems: Types[] = ["tv", "movie", "shortfilm", "ova", "ona"];

    useEffect(() => {
        console.log('load home recs settings', initialSettings)
        if (initialSettings) {
            setMinRating(initialSettings.minRating);
            setMinAge(initialSettings.minAge);
            setStatus(initialSettings.status);
            setTypes(initialSettings.types);
            setYears(initialSettings.years ?? null)
        }
    }, []);

    const handleSave = async () => {
        const curr = { minRating, minAge, status, types, years };
        await saveRecommendationSettings(curr);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => <HeaderBackButton onPress={() => {
                        const currSettings = { minRating, minAge, status, types, years };

                        if (isSettingsChanged(currSettings, initialSettings)) {
                            Alert.alert(
                                'Вы уверены?',
                                'У вас есть несохранённые изменения. Хотите сохранить перед выходом?',
                                [
                                    {
                                        text: 'Сохранить',
                                        style: 'default',
                                        onPress: async () => {
                                            await handleSave();
                                            router.back();
                                        },
                                    },
                                    {
                                        text: 'Не сохранять',
                                        style: 'destructive',
                                        onPress: () => router.back(),
                                    },
                                    {
                                        text: 'Отмена',
                                        style: 'cancel',
                                    },
                                ]
                            );
                        } else {
                            router.back();
                        }
                    }} />
                }}
            />

            <UIPage>
                <Section>
                    <UISwitch
                        label="Показывать рекомендации"
                        value={showRecs}
                        onValueChange={(v) => {
                            setShowRecs(!showRecs);
                            storage.setShowHomeRecs(v);
                        }}
                    />
                </Section>

                <HStack>
                    <UIText>Минимальный возраст</UIText>
                    <Spacer />
                    <ContextMenu>
                        <ContextMenu.Items>
                            {minAgeItems.map((a) => (
                                <Button
                                    key={a.value.toString()}
                                    systemImage={minAge.includes(a.value) ? "checkmark" : undefined}
                                    onPress={() => {
                                        console.log(a.value)
                                        if (!minAge.includes(a.value)) setMinAge((prev) => [...prev, a.value]);
                                        else setMinAge((prev) => prev.filter((v) => v !== a.value));
                                    }}
                                >
                                    {a.label}
                                </Button>
                            ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <HStack modifiers={[frame({ width: 100, height: 30 }), cornerRadius(200),]}>
                                <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ width: 100, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                    {minAgeItems.filter((a) => minAge.includes(a.value)).map(a => a.label).join(", ")}
                                </UIText>
                            </HStack>
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </HStack>

                <HStack>
                    <UIText>Минимальный рейтинг:</UIText>
                    <Spacer />
                    <ContextMenu>
                        <ContextMenu.Items>
                            {ratingItems.map((a, index) => (
                                <Button
                                    key={index}
                                    onPress={a.onSelect}
                                >
                                    {a.title}
                                </Button>
                            ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <HStack modifiers={[frame({ width: 60, height: 30 }), cornerRadius(200),]}>
                                <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ width: 60, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                    {minRating.toString()}
                                </UIText>
                            </HStack>
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </HStack>

                <HStack>
                    <UIText>Статус:</UIText>
                    <Spacer />
                    <ContextMenu>
                        <ContextMenu.Items>
                            {statusItems.map((s, index) => (
                                <Button
                                    key={`status-${index}`}
                                    systemImage={status.includes(s) ? 'checkmark' : undefined}
                                    onPress={() => {
                                        if (!status.includes(s)) setStatus((prev) => [...prev, s]);
                                        else setStatus((prev) => prev.filter((v) => v !== s));
                                    }}
                                >
                                    {statusLabel[s]}
                                </Button>
                            ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <HStack modifiers={[frame({ width: 140, height: 30 }), cornerRadius(200),]}>
                                <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ width: 140, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                    {status.map((s) => statusLabel[s]).join(", ")}
                                </UIText>
                            </HStack>
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </HStack>

                <HStack>
                    <UIText>Тип:</UIText>
                    <Spacer />
                    <ContextMenu>
                        <ContextMenu.Items>
                            {typeItems.map((t, index) => (
                                <Button
                                    key={`type-${index}`}
                                    systemImage={types.includes(t) ? 'checkmark' : undefined}
                                    onPress={() => {
                                        if (!types.includes(t)) setTypes((prev) => [...prev, t]);
                                        else setTypes((prev) => prev.filter((v) => v !== t));
                                    }}
                                >
                                    {typeLabels[t]}
                                </Button>
                            ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <HStack modifiers={[frame({ minWidth: 80, width: 170, height: 30 }), cornerRadius(200),]}>
                                <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ minWidth: 80, width: 170, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                    {types.map((t) => typeLabels[t]).join(", ")}
                                </UIText>
                            </HStack>
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </HStack>

                <Section title="Год">
                    <HStack>
                        <UIText>Начиная с</UIText>
                        <Spacer />
                        <ContextMenu>
                            <ContextMenu.Items>
                                {yearItem.map((a, index) => (
                                    <Button
                                        key={index}
                                        onPress={() => a.onSelect('from')}
                                    >
                                        {a.title === years?.year_from?.toString() ? `+ ${a.title}` : a.title}
                                    </Button>
                                ))}
                            </ContextMenu.Items>
                            <ContextMenu.Trigger>
                                <HStack modifiers={[frame({ width: 120, height: 30 }), cornerRadius(200),]}>
                                    <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ width: 120, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                        {years?.year_from?.toString() ?? "Не указан"}
                                    </UIText>
                                </HStack>
                            </ContextMenu.Trigger>
                        </ContextMenu>
                    </HStack>

                    <HStack>
                        <UIText>Заканчивая</UIText>
                        <Spacer />
                        <ContextMenu>
                            <ContextMenu.Items>
                                {yearItem.map((a, index) => (
                                    <Button
                                        key={index}
                                        onPress={() => a.onSelect('to')}
                                    >
                                        {a.title === years?.year_to?.toString() ? `+ ${a.title}` : a.title}
                                    </Button>
                                ))}
                            </ContextMenu.Items>
                            <ContextMenu.Trigger>
                                <HStack modifiers={[frame({ width: 120, height: 30 }), cornerRadius(200),]}>
                                    <UIText modifiers={[padding({ horizontal: 10, vertical: 10 }), frame({ width: 120, height: 30 }), background('rgba(108, 108, 108, 0.2)')]}>
                                        {years?.year_to?.toString() ?? "Не указан"}
                                    </UIText>
                                </HStack>
                            </ContextMenu.Trigger>
                        </ContextMenu>
                    </HStack>
                </Section>

                <Section title="">
                    <Host>
                        <Button onPress={handleSave}>
                            <UIText color="red" size={18} weight="semibold">
                                Сохранить
                            </UIText>
                        </Button>
                    </Host>
                </Section>

            </UIPage>
        </>
    )
}



// if (!useNativeUI)
//     return (
//         <ScrollView contentContainerStyle={{ flex: 1, padding: 20, gap: 20, paddingTop: useHeaderHeight() + 20 }}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
//                     Показывать рекомендации
//                 </Text>
//                 <Switch
//                     value={showRecs}
//                     onValueChange={(v) => {
//                         setShowRecs(!showRecs);
//                         storage.setShowHomeRecs(v);
//                     }}
//                 />
//             </View>

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
//                     Минимальный рейтинг:
//                 </Text>
//                 <DM
//                     triggerItem={
//                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(95,95,95,0.5)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 }}>
//                             <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>{minRating}</Text>
//                             <IconSymbol name='chevron.up.chevron.down' size={16} color={'white'} />
//                         </View>
//                     }
//                     items={ratingItems}
//                 />
//             </View>

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
//                     Минимальный возраст:
//                 </Text>
//                 <DropdownMenu.Root>
//                     <DropdownMenu.Trigger>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(95,95,95,0.5)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, maxWidth: 200 }}>
//                             <Text style={{ color: "white", fontWeight: "500", }} numberOfLines={1}>
//                                 {minAgeItems.filter((a) => minAge.includes(a.value)).map(a => a.label).join(", ")}
//                             </Text>
//                             <IconSymbol name='chevron.up.chevron.down' size={16} color={'white'} />
//                         </View>
//                     </DropdownMenu.Trigger>
//                     <DropdownMenu.Content>
//                         <DropdownMenu.Group>
//                             {minAgeItems.map((a) => (
//                                 <DropdownMenu.CheckboxItem
//                                     key={a.value.toString()}
//                                     value={minAge.includes(a.value) ? "on" : "off"}
//                                     onValueChange={(next) => {
//                                         if (next === "on") setMinAge((prev) => [...prev, a.value]);
//                                         else setMinAge((prev) => prev.filter((v) => v !== a.value));
//                                     }}
//                                 >
//                                     <DropdownMenu.ItemIndicator />
//                                     <DropdownMenu.ItemTitle style={{ color: "white" }}>
//                                         {a.label}
//                                     </DropdownMenu.ItemTitle>
//                                 </DropdownMenu.CheckboxItem>
//                             ))}
//                         </DropdownMenu.Group>
//                     </DropdownMenu.Content>
//                 </DropdownMenu.Root >
//             </View>

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
//                     Статус:
//                 </Text>
//                 <DropdownMenu.Root>
//                     <DropdownMenu.Trigger>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(95,95,95,0.5)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, maxWidth: 300 }}>
//                             <Text style={{ color: "white", fontWeight: "500", }} numberOfLines={1}>
//                                 {status.map((s) => statusLabel[s]).join(", ")}
//                             </Text>
//                             <IconSymbol name='chevron.up.chevron.down' size={16} color={'white'} />
//                         </View>
//                     </DropdownMenu.Trigger>
//                     <DropdownMenu.Content>
//                         <DropdownMenu.Group>
//                             {statusItems.map((s) => (
//                                 <DropdownMenu.CheckboxItem
//                                     key={s}
//                                     value={status.includes(s) ? "on" : "off"}
//                                     onValueChange={(next) => {
//                                         if (next === "on") setStatus((prev) => [...prev, s]);
//                                         else setStatus((prev) => prev.filter((v) => v !== s));
//                                     }}
//                                 >
//                                     <DropdownMenu.ItemIndicator />
//                                     <DropdownMenu.ItemTitle style={{ color: "white" }}>{statusLabel[s]}</DropdownMenu.ItemTitle>
//                                 </DropdownMenu.CheckboxItem>
//                             ))}
//                         </DropdownMenu.Group>
//                     </DropdownMenu.Content>
//                 </DropdownMenu.Root>
//             </View>

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
//                     Тип:
//                 </Text>
//                 <DropdownMenu.Root >
//                     <DropdownMenu.Trigger>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(95,95,95,0.5)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, maxWidth: 300 }}>
//                             <Text style={{ color: "white", fontWeight: "500", }} numberOfLines={1}>
//                                 {types.map((t) => typeLabels[t]).join(", ")}
//                             </Text>
//                             <IconSymbol name='chevron.up.chevron.down' size={16} color={'white'} />
//                         </View>
//                     </DropdownMenu.Trigger>
//                     <DropdownMenu.Content>
//                         <DropdownMenu.Group>
//                             {typeItems.map((t) => (
//                                 <DropdownMenu.CheckboxItem
//                                     key={t}
//                                     value={types.includes(t) ? "on" : "off"}
//                                     onValueChange={(next) => {
//                                         if (next === "on") setTypes((prev) => [...prev, t]);
//                                         else setTypes((prev) => prev.filter((v) => v !== t));
//                                     }}
//                                 >
//                                     <DropdownMenu.ItemIndicator />
//                                     <DropdownMenu.ItemTitle style={{ color: "white" }}>{typeLabels[t]}</DropdownMenu.ItemTitle>
//                                 </DropdownMenu.CheckboxItem>
//                             ))}
//                         </DropdownMenu.Group>
//                     </DropdownMenu.Content>
//                 </DropdownMenu.Root>
//             </View>

//             <Pressable style={{ padding: 15, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}
//                 onPress={() => saveRecommendationSettings({ minRating, minAge, status, types })}>
//                 <Text>SAVE</Text>
//             </Pressable>
//         </ScrollView >
//     );
