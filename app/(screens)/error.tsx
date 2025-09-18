import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ErrorPage() {
    const { errText } = useLocalSearchParams();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>{errText}</Text>
            <Image source={require('@/assets/images/404-load.png')} style={{width: 300, height: 300}} transition={600}/>
        </View>
    )
}