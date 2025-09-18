import Reccomendations from "@/components/HomeRecommendations";
import { View } from "react-native";

export default function ReccomendationsScreen() {
    return (
        <View style={{ paddingVertical: 10, paddingHorizontal: 10, flex: 1 }}>
            <Reccomendations />
        </View>
    )
}