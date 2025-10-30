import { ContextMenu } from "@/components/ContextComponent";
import { ThemedText } from "@/components/ui/ThemedText";
import { Comment, deleteComment } from "@/lib/firebase/userComments";
import { useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";

export const Comments = ({ comments, userID }: { comments: Comment[], userID: string }) => {
    const user = useUserStore(s => s.user);
    if (!user) return;
    if (comments.length < 1) return <ThemedText style={{ fontSize: 16, alignSelf: 'center', padding: 20 }}>Комментраиев нет</ThemedText>
    return (
        <Animated.FlatList
            scrollEnabled={false}
            data={comments}
            contentContainerStyle={{ paddingHorizontal: 15, gap: 30 }}
            itemLayoutAnimation={LinearTransition.delay(200)}
            renderItem={({ item }) => {
                const isOwner = userID === item.uid;
                return (
                    <Animated.View entering={FadeInDown} exiting={FadeOutLeft}>
                        <ContextMenu triggerItem={
                            <Link href={{ pathname: '/(screens)/user/[id]', params: { id: item.uid } }}>
                                <View style={{ flexDirection: 'row', gap: 10, flexShrink: 1, flex: 1, backgroundColor: 'black', margin: 5 }}
                                // onPress={handleNav}
                                >
                                    <Image source={{ uri: item.avatar }} style={{ width: 45, height: 45, borderRadius: 12 }} />
                                    <View style={{ flex: 1, flexShrink: 1, gap: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontWeight: '600' }}>{item.name}</Text>
                                            <Text style={{ color: 'white' }}>{item.date}</Text>
                                        </View>
                                        <Text style={{ color: 'white' }}>{item.text}</Text>
                                    </View>
                                </View>
                            </Link>
                        }
                            items={
                                (user.uid === item.uid && userID)
                                    ? [
                                        {
                                            title: "Удалить",
                                            destructive: true,
                                            onSelect: async () => {
                                                console.log("Удаляем свой комментарий");
                                                await deleteComment(userID, item.id);
                                            },
                                        },
                                    ]
                                    : []
                            }
                        />
                    </Animated.View>
                )
            }}
        />
    )
}