import { cleanDescription } from "@/utils/cleanDescription";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface PreviewProps {
    bannerImg?: string;
    img: string;
    width: number;
    title: string;
    score: string | number;
    isAnons: boolean;
    description?: string;
}

export const Preview = ({ bannerImg, img, width, title, score, isAnons = false, description }: PreviewProps) => {
    const url = bannerImg || img;

    return (
        <>

            <View style={{ position: 'relative' }}>
                <Image
                    source={{ uri: url }}
                    style={{
                        width: bannerImg ? width : '100%',
                        height: 100,
                        backgroundColor: 'black',
                    }}
                    contentFit='cover'
                    contentPosition={bannerImg ? 'center' : undefined}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,1)']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width,
                        height: 100,
                    }}
                />
            </View>

            <View style={{ backgroundColor: 'black', padding: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                            maxWidth: width - 100,
                        }}
                    >
                        {title}
                    </Text>

                    <View
                        style={{
                            backgroundColor: isAnons ? 'red' : 'green',
                            paddingHorizontal: 6,
                            paddingVertical: 4,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                            {score}
                        </Text>
                    </View>
                </View>

                {description ? (
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 14,
                            fontWeight: '600',
                            textAlign: 'justify',
                        }}
                        numberOfLines={8}
                    >
                        {cleanDescription(description)}
                    </Text>
                ) : (
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }} numberOfLines={10}>
                        Нет описания
                    </Text>
                )}
            </View>
        </>
    )
}