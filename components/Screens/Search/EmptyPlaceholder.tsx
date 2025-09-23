import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("screen");

export const EmptyPlaceholder = () => {
    return (
        <View style={style.constainer}>
            <LinearGradient
                colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.0)", "rgba(0, 0, 0, 0.85)"]}
                style={style.gradient}
            />
            <Image
                source={require('@/assets/images/404.png')}
                style={style.image}
            />
            <Text style={style.text}>
                Попробуйте изменить запрос или фильтры поиска
            </Text>
        </View>
    )
}

const style = StyleSheet.create({
    constainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: height / 8,
        position: "relative",
        minHeight: height / 2.5,
    },
    gradient: {
        position: "absolute",
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    image: {
        width: width / 1.75,
        height: height / 3,
        opacity: 0.85,
        marginBottom: 24,
        zIndex: 1,
    },
    text: {
        color: "#b0b0b0",
        fontSize: 15,
        marginTop: 8,
        zIndex: 3,
        textAlign: "center",
        maxWidth: width / 1.5,
    }
})