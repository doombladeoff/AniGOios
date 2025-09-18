import { IconSymbol } from "@/components/ui/IconSymbol";
import { router, Stack } from "expo-router";
import { useMemo } from "react";
import { Pressable } from "react-native-gesture-handler";

export default function NewsLayout({ segment }: { segment: string }) {
    const show = false;

    if (!show) return <Stack.Screen name={undefined} />;

    const rootScreen = useMemo(() => {
        switch (segment) {
            case "(news)":
                return (
                    <Stack.Screen
                        name="newsList"
                        options={{
                            title: 'Новости'
                        }}
                    />
                );
        }
    }, [segment]);

    return (
        <Stack>
            {rootScreen}
            <Stack.Screen name="news" options={{
                title: 'Новость',
                headerLeft: () => <Pressable
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ paddingLeft: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.85, shadowRadius: 4 }}>
                    <IconSymbol name="arrow.left" size={24} color={'white'} />
                </Pressable>
            }} />
        </Stack>
    )
}