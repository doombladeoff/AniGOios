import { GradientBlur } from "@/components/GradientBlur"
import { Button, Host, HStack, Image, Text } from "@expo/ui/swift-ui"
import { frame, glassEffect, padding } from "@expo/ui/swift-ui/modifiers"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"
import { easeGradient } from "react-native-easing-gradient"
import { Spacer } from "react-native-ios-utilities"
import { SFSymbols6_0 } from "sf-symbols-typescript"

export const HeaderFavorite = ({ rightIcon, onPress }: { rightIcon: SFSymbols6_0; onPress: () => void }) => {
    const { colors, locations } = easeGradient({
        colorStops: {
            0: { color: 'black' },
            0.5: { color: 'rgba(0,0,0,0.9)' },
            1: { color: 'transparent' }
        },
    });

    return (
        <View style={[{ height: 120 }]}>
            <GradientBlur
                colors={colors}
                locations={locations}
                containerStyle={{
                    position: 'absolute',
                    top: 0,
                    zIndex: -1, width: '100%', height: 120,
                }}
                tint="light"
                blurIntensity={20}
            />
            <LinearGradient
                colors={['black', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
                style={[StyleSheet.absoluteFill, { width: '100%', height: 120, zIndex: 0 }]}
                pointerEvents='none'
            />
            <Host style={{ width: '100%', height: 100 }}>
                <HStack modifiers={[padding({ horizontal: 20 })]}>
                    <Button onPress={() => router.back()} role='default' variant='glass'>
                        <Image systemName="arrow.left" size={18} color="white" modifiers={[frame({ width: 25, height: 35 })]} />
                    </Button>

                    <Spacer />
                    <Text modifiers={[
                        frame({ width: 120, height: 50 }),
                        glassEffect({
                            glass: {
                                variant: 'regular',
                            },
                        }),
                    ]}>Избранное</Text>
                    <Spacer />
                    <Button role='default' variant='glass' onPress={onPress}>
                        <Image systemName={rightIcon} size={18} color="white" modifiers={[frame({ width: 25, height: 35 })]} />
                    </Button>
                </HStack>
            </Host>
        </View>
    )
}