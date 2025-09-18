import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUserStore } from "@/store/userStore";
import { Host, LinearProgress } from "@expo/ui/swift-ui";
import { padding, shadow } from "@expo/ui/swift-ui/modifiers";
import { Text, View } from "react-native";

export const Level = () => {
    const userRang = useUserStore(s => s.user);
    if (!userRang) return;

    return (
        <View>
            <View style={{ gap: 10, marginVertical: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{userRang.rang.level} уровень</Text>
                    <IconSymbol name='trophy.fill' size={24} color={'orange'} />
                </View>
                <Host matchContents>
                    <LinearProgress progress={userRang.rang.exp / (userRang.rang.level * 100)} color={'orange'}
                        modifiers={[shadow({ radius: 6, color: 'orange' }), padding({ horizontal: 0 })]}
                    />
                </Host>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                        <Text style={{ color: 'white', fontSize: 16 }}>{userRang.rang.exp} xp</Text>
                    </View>
                    <Text style={{ color: 'white', fontSize: 16 }}>{userRang.rang.level * 100} xp</Text>
                </View>
            </View>
        </View>
    )
};