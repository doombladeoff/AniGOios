import { Box, Canvas, Circle, Extrapolate, Group, Image, Mask, RadialGradient, Shadow, Skia, interpolate, rect, rrect, useImage, vec } from "@shopify/react-native-skia"
import React from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { SensorType, useAnimatedReaction, useAnimatedSensor, useDerivedValue, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"


import { processTransform3d, toMatrix3 } from "./redash/Matrix4"

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('screen')


export const degreeToRad = (degree: number) => {
    "worklet";
    return degree * (Math.PI / 180);
};

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 6
    }
})

export const Grav = () => {
    // Shared values for animation state
    const roll = useSharedValue(0);
    const pitch = useSharedValue(0);
    const safeAreaInsets = useSafeAreaInsets();

    // Load the image for the NFT
    const image = useImage('https://github.com/naraB/SensorRotation/blob/main/src/assets/nft.png?raw=true');

    // Use the rotation sensor to get device orientation data
    const animatedSensor = useAnimatedSensor(SensorType.ROTATION, { interval: 1 });

    const width = (ScreenWidth - 100);
    const height = width;
    const y = 100;
    const x = (ScreenWidth - width) / 2;

    const lightXOrigin = ScreenWidth / 2;
    const lightYOrigin = (height + y) / 2;

    // Use `useAnimatedReaction` to update shared values `roll` and `pitch`
    // whenever the sensor values change. This runs on the UI thread.
    useAnimatedReaction(() => animatedSensor.sensor.value, (s) => {
        pitch.value = s.pitch;
        roll.value = s.roll;
    }, []);

    // We use `useDerivedValue` to create new shared values that
    // automatically update whenever their dependencies (`roll` and `pitch`) change.
    // This replaces the old `setInterval` approach and fixes the Skia error.
    const lightX = useDerivedValue(() => {
        return interpolate(
            roll.value,
            [-Math.PI, Math.PI],
            [-250 * 2, 250 * 2]
        );
    }, [roll]);

    const lightY = useDerivedValue(() => {
        return interpolate(
            pitch.value / 6,
            [-Math.PI, Math.PI],
            [-500 * 2, 500 * 2]
        );
    }, [pitch]);

    const rotateY = useDerivedValue(() => {
        return interpolate(
            roll.value,
            [-Math.PI, Math.PI],
            [degreeToRad(20), degreeToRad(-20)],
            Extrapolate.CLAMP
        );
    }, [roll]);

    const rotateX = useDerivedValue(() => {
        return interpolate(
            pitch.value / 2,
            [-Math.PI, Math.PI],
            [degreeToRad(40), degreeToRad(-40)],
            Extrapolate.CLAMP
        );
    }, [pitch]);

    // Use `useDerivedValue` to create the transform and matrix
    // This will re-calculate whenever `lightX` and `lightY` change
    const transform = useDerivedValue(
        () => [
            { translateX: lightX.value },
            { translateY: lightY.value },
        ],
        [lightX, lightY]
    );

    // This will re-calculate whenever `rotateX` and `rotateY` change
    const matrix = useDerivedValue(() => {
        const mat3 = toMatrix3(processTransform3d([
            { perspective: 300 },
            { rotateY: rotateY.value },
            { rotateX: rotateX.value },
        ]));
        return Skia.Matrix(mat3);
    }, [rotateX, rotateY])

    // Skia components
    const mask =
        (<Box box={rrect(rect(x, y, width, height), 24, 24)} >
            <Shadow dx={12} dy={12} blur={25} color="black" />
        </Box>);

    const nft = image && (
        <Group clip={rrect(rect(x, y, width, height), 24, 24)}>
            <Image
                image={image}
                x={x}
                y={y}
                width={width}
                height={height}
                rect={rect(x, y, width, height)}
            />
        </Group >
    );

    const light =
        (<Group origin={vec(lightXOrigin, lightYOrigin)} transform={transform} blendMode="plus">
            <Circle cy={lightYOrigin} cx={lightXOrigin} r={256}>
                <RadialGradient
                    c={vec(lightXOrigin, lightYOrigin)}
                    r={128}
                    mode="clamp"
                    colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.01)"]}
                />
            </Circle>
        </Group>);

    const shadow =
        (<Box box={rrect(rect(x, y, width, height), 26, 26)} color="rgba(255,255,255,0.5)">
            <Shadow dx={8} dy={8} blur={32} color="rgba(199,216,89,0.8)" />
            <Shadow dx={4} dy={8} blur={16} color="rgba(221,111,208,0.6)" />
        </Box>);

    return (
        <View style={{ flex: 1 }}>
            <Canvas
                style={{
                    width: "100%",
                    height: height + 100 + y,
                    zIndex: 1000
                }}
            >
                <Group origin={{ x: (ScreenWidth) / 2, y: (ScreenHeight) / 2 }} matrix={matrix}>
                    {shadow}
                    <Mask
                        clip
                        mask={mask}>
                        {nft}
                    </Mask>
                </Group>
                {light}
            </Canvas >
            <View style={{ top: -60, marginHorizontal: 50 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.placeholder, { height: 24, width: 80 }]} />
                    <View style={[styles.placeholder, { height: 24, width: 80 }]} />
                </View>
            </View>
            <View style={{ flex: 1, marginHorizontal: 50 }} >
                <View style={[styles.placeholder, { height: 40, width: '60%', }]} />
                <View style={[styles.placeholder, { height: 24, width: '80%', marginTop: 12 }]} />
                <View style={[styles.placeholder, { height: 32, width: '90%', marginTop: 48 }]} />
            </View>
            <View
                style={{
                    height: 60,
                    borderRadius: 12,
                    alignItems: "center",
                    marginHorizontal: 32,
                    backgroundColor: '#111',
                    justifyContent: "center",
                    marginBottom: safeAreaInsets.bottom + 20,
                }}>
                <Text
                    style={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: "500",
                        fontSize: 20
                    }}>
                    View on OpenSea ↗
                </Text>
            </View>
        </View >
    )
}
