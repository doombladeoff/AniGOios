import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, View } from "react-native";

const { width, height } = Dimensions.get("screen");

export const EmptyPlaceholder = () => {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: height / 8,
                position: "relative",
                minHeight: height / 2.5,
            }}
        >
            <LinearGradient
                colors={["rgba(0,0,0,0.0)", "rgba(0, 0, 0, 0.85)"]}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "50%",

                    zIndex: 2,
                }}
            />
            <Image
                source={require('@/assets/images/404.png')}
                style={{
                    width: width / 1.75,
                    height: height / 3,
                    opacity: 0.85,
                    marginBottom: 24,
                    zIndex: 1,
                }}
            />
            <Text
                style={{
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: "700",
                    letterSpacing: 0.5,
                    marginTop: 12,
                    zIndex: 3,
                    textShadowColor: "rgba(0,0,0,0.7)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 8,
                }}
            >
                {/* Ничего не найдено */}
            </Text>
            <Text
                style={{
                    color: "#b0b0b0",
                    fontSize: 15,
                    marginTop: 8,
                    zIndex: 3,
                    textAlign: "center",
                    maxWidth: width / 1.5,
                }}
            >
                Попробуйте изменить запрос или фильтры поиска
            </Text>
        </View>
    )
}