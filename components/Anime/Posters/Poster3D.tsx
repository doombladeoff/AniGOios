import { Card } from "@/components/Anime/Card";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Status } from "../Status";

interface Poster3DProps {
    showStatus: boolean;
    statusHeader?: string;
    img: string;
    imgSmall: string;
    setPosterLoad: (v: boolean) => void;
    id: string
}
const Poster3D = ({ showStatus, statusHeader, img, imgSmall, setPosterLoad, id }: Poster3DProps) => {
    const insets = useSafeAreaInsets();
    console.log('Poster3D Render', id);
    return (
        <View>
            <View style={{ width: '100%', height: 400, marginVertical: insets.top, alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <Animated.View entering={FadeInUp.duration(1500)} style={{ shadowColor: 'gray', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 2, width: 0 } }}>
                    <Card>
                        {showStatus && <Status id={id} showType="poster" />}
                        <Image
                            source={{ uri: img }}
                            style={{ width: 240, height: 340, borderRadius: 12 }}
                            priority={'high'}
                            transition={500}
                            contentFit="cover"
                            onLoadEnd={() => setPosterLoad(true)}
                        />
                    </Card>
                </Animated.View>
            </View>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 470, zIndex: -2 }} />
            <Image priority={'high'} transition={300} source={{ uri: imgSmall }} style={{ width: '100%', height: 470, position: 'absolute', zIndex: -3, top: 0, transform: [{ rotateX: '0deg' }] }} blurRadius={30} contentFit='cover' />
        </View>
    )
}

export default memo(Poster3D)