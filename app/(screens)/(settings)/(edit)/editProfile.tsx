import { UIPage } from "@/components/Screens/Settings/Page";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/store/userStore";
import { useAvatarUser } from "@/utils/firebase/user-images/uploadImages";
import { Button, Host, HStack, LinearProgress, Section, Spacer, Text, TextField, TextFieldRef, Image as UIImage, VStack, ZStack } from "@expo/ui/swift-ui";
import { cornerRadius, foregroundStyle, frame, onTapGesture, zIndex } from "@expo/ui/swift-ui/modifiers";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function EditProfileScreen() {
    const user = useUserStore(s => s.user);
    const { width } = useWindowDimensions();
    const headerHeight = useHeaderHeight();

    const [text, setText] = useState('');
    const tfRef = useRef<TextFieldRef>(null);

    const { pickImage, isLoadImage, progress } = useAvatarUser();
    const handlePickImage = useCallback((type: 'avatar' | 'banner') => {
        pickImage(type);
    }, [pickImage]);

    useEffect(() => console.log(text), [text])
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1, paddingTop: headerHeight }}>
            <Image source={{ uri: user?.bannerURL }} style={{ width: width - 40, height: 120, alignSelf: 'center', marginTop: 20, borderRadius: 20 }} transition={500} />

            <Animated.View style={{ alignSelf: 'center', position: 'absolute', top: 110, zIndex: 1 }} entering={FadeIn} exiting={FadeOut} key={`${isLoadImage}`}>
                <Host style={{ height: 5, width: width - 60, paddingVertical: 10, opacity: isLoadImage ? 1 : 0 }}>
                    <LinearProgress progress={progress} color={'orange'} />
                </Host>
            </Animated.View>


            <UIPage scroll={false}>
                <HStack>
                    <ZStack modifiers={[zIndex(1)]}>
                        <HStack spacing={16}>
                            <HStack
                                modifiers={[
                                    frame({ width: 80, height: 80 }),
                                    cornerRadius(100),
                                ]}
                            >
                                <Image
                                    source={{ uri: user?.avatarURL }}
                                    style={{ width: 80, height: 80 }}
                                    contentFit="fill"
                                    transition={500}
                                />
                            </HStack>

                            <VStack alignment="leading" spacing={5}>
                                <Text
                                    modifiers={[foregroundStyle('white')]}
                                    color={'white'}
                                    size={22}
                                    weight="bold"
                                >
                                    {`${auth.currentUser?.displayName} ${user?.displayName}` || ''}
                                </Text>
                                <HStack spacing={10}>
                                    <Text modifiers={[foregroundStyle("gray")]}>
                                        {user?.email || ''}
                                    </Text>
                                    <UIImage systemName="checkmark.seal.fill" size={14} color="skyblue" />
                                </HStack>

                            </VStack>
                        </HStack>
                    </ZStack>
                </HStack>

                <Section>
                    <HStack modifiers={[onTapGesture(() => handlePickImage('avatar'))]}>
                        <Text>Изменить аватар</Text>
                        <Spacer />
                        <UIImage systemName="chevron.right" size={24} />
                    </HStack>
                    <HStack modifiers={[onTapGesture(() => handlePickImage('banner'))]}>
                        <Text>Изменить баннер</Text>
                        <Spacer />
                        <UIImage systemName="chevron.right" size={24} />
                    </HStack>
                </Section>

                <Section>
                    <HStack spacing={80}>
                        <TextField
                            ref={tfRef}
                            defaultValue=""
                            placeholder="username"
                            numberOfLines={1}
                            onChangeText={(t) => setText(t)}
                            modifiers={[frame({ width: 150 })]}
                        />
                        <Spacer />
                        <Host style={{ width: 15, height: 15 }}>
                            <UIImage systemName="xmark" size={16} modifiers={[onTapGesture(() => { tfRef.current?.setText(''); setText('') })]} />
                        </Host>
                    </HStack>

                </Section>

                <Button>
                    <Text>Сохранить</Text>
                </Button>
            </UIPage>
        </ScrollView>
    )
};