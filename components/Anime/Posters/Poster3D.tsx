import { Card } from "@/components/Anime/Card";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Status } from "../Status";

interface Poster3DProps {
    showStatus: boolean;
    img: string;
    imgSmall: string;
    id: string
};

const GradeintColors = ['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)'] as [ColorValue, ColorValue, ...ColorValue[]];

const Poster3D = ({ showStatus, img, imgSmall, id }: Poster3DProps) => {
    const insets = useSafeAreaInsets();
    return (
        <View>
            <Animated.View entering={FadeIn.duration(1000)} style={[styles.container, { marginVertical: insets.top }, styles.shadow]}>
                <Card>
                    {showStatus && <Status id={id} showType="poster" containerStyle={styles.statusContainer} />}
                    <Image
                        source={{ uri: img }}
                        style={{ width: 240, height: 340, borderRadius: 12 }}
                        priority={'high'}
                        transition={500}
                        contentFit="cover"
                    />
                </Card>
            </Animated.View>
            <LinearGradient colors={GradeintColors} style={styles.gradient} />
            <Image priority={'high'} transition={300} source={{ uri: imgSmall }} style={styles.backImage} blurRadius={30} contentFit='cover' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    shadow: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 2, width: 0 }
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 470,
        zIndex: -2
    },
    backImage: {
        width: '100%',
        height: 470,
        position: 'absolute',
        zIndex: -3,
        top: 0,
        transform: [{ rotateX: '0deg' }]
    },
    statusContainer: {
        top: 4,
        zIndex: 200,
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
    }
})

export default memo(Poster3D)