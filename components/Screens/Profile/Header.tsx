import { useUserStore } from "@/store/userStore";
import { Image, ImageStyle } from "expo-image";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useShallow } from "zustand/shallow";

interface HeaderProps {
    bannerStyle?: StyleProp<ImageStyle>;
    avatarContainer?: StyleProp<ViewStyle>;
    avatarStyle?: StyleProp<ImageStyle>;
    bannerUrl?: string;
    avatarUrl?: string;
    useAnimation?: boolean;
}

export const Header = ({ bannerStyle, avatarContainer, avatarStyle, bannerUrl, avatarUrl, useAnimation = true }: HeaderProps) => {
    const { banner, avatar, defAvatar } = useUserStore(useShallow(s => ({ banner: s.user?.bannerURL, avatar: s.user?.avatarURL, defAvatar: s.user?.photoURL })));

    return (
        <Animated.View entering={useAnimation ? FadeInUp.delay(600) : undefined}>
            <>
                <Image source={{ uri: bannerUrl || banner }} style={bannerStyle} transition={600} />
                <Animated.View entering={useAnimation ? FadeIn.delay(1000) : undefined} style={avatarContainer}>
                    <Image source={{ uri: avatarUrl || avatar }} style={avatarStyle} transition={1200} />
                </Animated.View>
            </>
        </Animated.View>
    )
}