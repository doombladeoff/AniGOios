import { useUserStore } from "@/store/userStore";
import { Image } from "expo-image";
import { View } from "react-native";
import { IconSymbol } from "../IconSymbol";

export const UserTab = ({ color }: { color: string }) => {
    const user = useUserStore(s => s.user);

    return (
        <>
            {user ? (
                <View style={{ width: 28, height: 28 }}>
                    {user ? (
                        <>
                            {(user.avatarURL || user.photoURL) ? (
                                <Image
                                    source={{ uri: user.avatarURL || user.photoURL || '' }}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 100,
                                        backgroundColor: 'gray'
                                    }}
                                    transition={300}
                                    cachePolicy={'memory-disk'}
                                />
                            ) : (
                                <IconSymbol
                                    name="person.fill"
                                    size={28}
                                    color={color}
                                />
                            )}
                        </>

                    ) : (
                        <IconSymbol
                            name="person.fill"
                            size={28}
                            color={color}
                        />
                    )}
                </View>
            ) : (
                <IconSymbol
                    size={28}
                    name="person.fill"
                    color={color}
                />
            )}
        </>
    );
};