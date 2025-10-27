import { ScoreStat } from "@/API/Shikimori/Shikimori.types";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeIn, FadeInLeft, FadeInUp, useAnimatedProps, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, G, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";

interface RatingStatsProps {
    score: number;
    scoresStats: ScoreStat[];
    isDark: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RatingStats = ({ score, scoresStats = [], isDark }: RatingStatsProps) => {
    const [expanded, setExpanded] = useState(false);

    const totalVotes = useMemo(() => scoresStats.reduce((sum, s) => sum + s.count, 0), [scoresStats]);
    const percentages = useMemo(
        () => scoresStats.map((s) => ({ ...s, percent: (s.count / totalVotes) * 100 })),
        [scoresStats, totalVotes]
    );

    const size = 140;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (expanded) {
            progress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 0;
        }
    }, [expanded]);

    const getNeonColor = (score: number) => {
        switch (true) {
            case score >= 10:
                return ["#00FF00", "#33FF33"]; // яркий зелёный
            case score >= 9:
                return ["#33FF00", "#66FF33"]; // насыщенный лайм
            case score >= 8:
                return ["#66FF00", "#99FF33"]; // зелёно-жёлтый
            case score >= 7:
                return ["#CCFF00", "#DDFF33"]; // жёлто-зелёный
            case score >= 6:
                return ["#FFCC00", "#FFDD33"]; // ярко-жёлтый
            case score >= 5:
                return ["#FF9900", "#FFAA33"]; // насыщенный оранжевый
            case score >= 4:
                return ["#FF3300", "#FF6666"]; // ярко-красный
            default:
                return ["#AAAAAA", "#CCCCCC"]; // серый неон для низких оценок
        }
    };

    const AnimatedSegment = ({ index, score, percent, offset }: { index: number; score: number; percent: number; offset: number }) => {
        const segmentProgress = useSharedValue(0);

        useEffect(() => {
            segmentProgress.value = withDelay(
                index * 200,
                withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) })
            );
        }, [expanded]);

        const animatedProps = useAnimatedProps(() => {
            const dash = (circumference * percent * segmentProgress.value) / 100;
            return {
                strokeDasharray: `${dash} ${circumference}`,
            };
        });

        return (
            <AnimatedCircle
                animatedProps={animatedProps}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={`url(#grad${score})`}
                strokeWidth={strokeWidth}
                strokeDashoffset={-(circumference * offset) / 100}
                strokeLinecap="round"
                fill="transparent"
            />
        );
    };


    return (
        <View style={{ marginTop: 8 }}>
            {expanded ? (
                <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(false)}>
                    <Animated.View entering={FadeInUp.duration(400)}>
                        <Animated.View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 16,
                                borderRadius: 20,
                                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                shadowColor: "#00fff0",
                                shadowOpacity: 0.2,
                                shadowRadius: 10,
                            }}
                        >
                            <Animated.View entering={FadeIn.delay(450)}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 16,
                                }}
                            >
                                <Svg width={size} height={size}>
                                    <Defs>
                                        {percentages.map((p) => {
                                            const [c1, c2] = getNeonColor(p.score);
                                            return (
                                                <SvgLinearGradient
                                                    key={p.score}
                                                    id={`grad${p.score}`}
                                                    x1="0%"
                                                    y1="0%"
                                                    x2="100%"
                                                    y2="100%"
                                                >
                                                    <Stop offset="0%" stopColor={c1} stopOpacity="1" />
                                                    <Stop offset="100%" stopColor={c2} stopOpacity="1" />
                                                </SvgLinearGradient>
                                            );
                                        })}
                                    </Defs>
                                    <G rotation="-90" originX={size / 2} originY={size / 2}>
                                        {percentages.map((p, i) => {
                                            const offset = percentages.slice(0, i).reduce((sum, s) => sum + s.percent, 0);
                                            return <AnimatedSegment key={p.score} index={i} score={p.score} percent={p.percent} offset={offset} />;
                                        })}
                                    </G>
                                </Svg>

                                <MaskedView
                                    style={{
                                        position: "absolute",
                                        alignSelf: "center",
                                        top: size / 2 - 8,
                                        width: 70,
                                        height: 44,
                                    }}
                                    maskElement={
                                        <Text
                                            style={{
                                                fontSize: 38,
                                                fontWeight: "800",
                                                textAlign: "center",
                                            }}
                                        >
                                            {score.toFixed(1)}
                                        </Text>
                                    }
                                >
                                    <LinearGradient
                                        colors={getNeonColor(score)}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ flex: 1 }}
                                    />
                                </MaskedView>

                                <View
                                    style={{
                                        marginTop: 16,
                                        width: "100%",
                                        flexWrap: "wrap",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {percentages.map((p, index) => (
                                        <Animated.View
                                            entering={FadeInLeft.delay(150 * index)}
                                            key={p.score}
                                            style={{
                                                width: "48%",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginVertical: 4,
                                                alignItems: "center",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                                <IconSymbol
                                                    name="star.fill"
                                                    size={14}
                                                    color={getNeonColor(p.score)[1]}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "600",
                                                        color: isDark ? "#fff" : "#000",
                                                    }}
                                                >
                                                    {p.score}
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: isDark ? "#aaa" : "#555",
                                                }}
                                            >
                                                {p.count} ({p.percent.toFixed(1)}%)
                                            </Text>
                                        </Animated.View>
                                    ))}
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? "#888" : "#666",
                                        marginTop: 10,
                                    }}
                                >
                                    Основано на данных Shikimori
                                </Text>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setExpanded(true)}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <MaskedView
                        style={{ width: 60, height: 40 }}
                        maskElement={
                            <Text style={{ fontSize: 38, fontWeight: "800" }}>
                                {score.toFixed(1)}
                            </Text>
                        }
                    >
                        <LinearGradient
                            colors={getNeonColor(score)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1 }}
                        />
                    </MaskedView>
                    <IconSymbol
                        name="chevron.right"
                        size={26}
                        color={isDark ? "#fff" : "#000"}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};