import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/hooks/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("screen");

export const EmptyPlaceholder = () => {
    const isDarkMode = useTheme().theme === 'dark';
    return (
        <ThemedView darkColor="black" lightColor="white" style={style.constainer}>
            <LinearGradient
                colors={isDarkMode ? ["rgba(0,0,0,0.0)", "rgba(0,0,0,0.0)", "rgba(0, 0, 0, 0.85)"] : ['transparent', 'rgba(255, 255, 255, 0)', "rgba(255, 255, 255, 1)"]}
                style={[style.gradient, { overflow: 'hidden', height: '35%', alignSelf: 'center' }]}
            />
            <View style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 5,
            }}>
                <Image
                    source={require('@/assets/images/404.png')}
                    style={style.image}
                />
            </View>

            <Text style={style.text}>
                Попробуйте изменить запрос или фильтры поиска
            </Text>
        </ThemedView>
    )
}

const style = StyleSheet.create({
    constainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flex: 1,
    },
    gradient: {
        position: "absolute",
        width: "100%",
        zIndex: 2,
    },
    image: {
        width: width / 1.75,
        height: height / 2.8,
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