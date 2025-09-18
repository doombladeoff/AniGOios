import SettingSection from "@/components/Screens/Settings/SettingSection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { Text } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";

export default function ExperementalPages() {
    return (
        <ScrollView>
            <SettingSection label="">
                <Pressable
                    onPress={() => router.push({ pathname: '/(experemental)/list' })}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>List</Text>
                    <IconSymbol name='chevron.right' size={22} color={"gray"} />
                </Pressable>

                <Pressable
                    onPress={() => router.push({ pathname: '/(experemental)/pages' })}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>Pages</Text>
                    <IconSymbol name='chevron.right' size={22} color={"gray"} />
                </Pressable>

                <Pressable
                    onPress={() => router.push({ pathname: '/(experemental)/recommendations' })}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>Рекомендации</Text>
                    <IconSymbol name='chevron.right' size={22} color={"gray"} />
                </Pressable>
            </SettingSection>
        </ScrollView>
    )
}