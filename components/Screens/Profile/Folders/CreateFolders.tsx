import { BottomSheet as BS } from "@/components/ui/BottomSheet";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { createFolder, editAnimeFolder } from "@/lib/firebase/userFolders";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/ThemeContext";
import { BottomSheet, Button, ColorPicker, Host, HStack, Spacer, Image as UIImage, Text as UIText, TextField as UITextField, VStack } from "@expo/ui/swift-ui";
import { background, cornerRadius, frame, padding, shadow } from "@expo/ui/swift-ui/modifiers";

interface CreateEditFolders {
    userId: string;
    isOpen: boolean;
    openCreateFolder: (v: boolean) => void;
    closeEditFolder: ({
        edit,
        name,
        color,
    }: {
        edit: boolean;
        name: string;
        color: string;
    }) => void;
    editFolder: { edit: boolean; oldName: string; oldColor: string };
}

export const CreateFolders = ({
    userId,
    isOpen,
    openCreateFolder,
    editFolder,
    closeEditFolder,
}: CreateEditFolders) => {
    const isDarkMode = useTheme().theme === 'dark';
    const [folderName, setFolderName] = useState<string>("");
    const [colorFolder, setColorFolder] = useState<string>(
        editFolder.edit ? editFolder.oldColor : "#ffffff"
    );

    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const useNativeUI = true;
    if (!useNativeUI)
        return (
            <BS
                isOpen={isOpen}
                onRequest={() => {
                    openCreateFolder(false);
                    closeEditFolder({ edit: false, name: "", color: "" });
                }}
            >
                <View style={{ width: "100%", justifyContent: "flex-end", zIndex: 2 }}>
                    <Animated.View
                        entering={SlideInDown}
                        style={{
                            backgroundColor: "#1e1e1e",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingHorizontal: 20,
                            paddingTop: 15,
                            gap: 20,
                            paddingBottom: insets.bottom,
                        }}
                    >
                        {/* Заголовок */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                                {editFolder.edit
                                    ? `Редактировать папку "${editFolder.oldName}"`
                                    : "Создать папку"}
                            </Text>

                            <Pressable
                                hitSlop={15}
                                style={{
                                    padding: 8,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    borderRadius: 100,
                                }}
                                onPress={() => openCreateFolder(false)}
                            >
                                <IconSymbol name="xmark" size={18} color={"white"} />
                            </Pressable>
                        </View>

                        <View style={{ gap: 20 }}>
                            {/* Название */}
                            <View style={{ gap: 8 }}>
                                <Text
                                    style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                                >
                                    Укажите название
                                </Text>
                                <TextInput
                                    placeholder="Название папки"
                                    placeholderTextColor={"#999"}
                                    style={{
                                        color: "white",
                                        backgroundColor: "#2d2d2d",
                                        padding: 12,
                                        borderRadius: 12,
                                        fontSize: 16,
                                    }}
                                    onChangeText={setFolderName}
                                    defaultValue={editFolder.edit ? editFolder.oldName : ""}
                                />
                            </View>

                            {/* Выбор цвета */}
                            <Host matchContents>
                                <ColorPicker
                                    label="Цвет папки"
                                    selection={colorFolder}
                                    onValueChanged={setColorFolder}
                                />
                            </Host>

                            {/* Превью папки */}
                            <View
                                style={{
                                    alignSelf: "center",
                                    backgroundColor: "#303034",
                                    paddingVertical: 20,
                                    paddingHorizontal: 30,
                                    borderRadius: 14,
                                    gap: 10,
                                    alignItems: "center",
                                    marginTop: 10,
                                }}
                            >
                                <IconSymbol name="folder.fill" size={32} color={colorFolder} />
                                <Text style={{ color: "white", fontSize: 15 }}>Папка</Text>
                            </View>
                        </View>


                        <Pressable
                            onPress={() => {
                                if (folderName.trim().length === 0) return;
                                if (!userId) return;
                                !editFolder.edit
                                    ? createFolder(userId, folderName, colorFolder)
                                    : editAnimeFolder(
                                        userId,
                                        editFolder.oldName,
                                        folderName,
                                        colorFolder
                                    );
                                openCreateFolder(false);
                            }}
                            style={{
                                marginTop: 20,
                                backgroundColor: "skyblue",
                                borderRadius: 12,
                                alignItems: "center",
                                paddingVertical: 14,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "#000" }}>
                                {!editFolder.edit ? "Создать папку" : "Изменить папку"}
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BS>
        );

    return (
        <Host style={{ position: 'absolute', width }}>
            <BottomSheet isOpened={isOpen} onIsOpenedChange={() => {
                openCreateFolder(false);
                closeEditFolder({ edit: false, name: "", color: "" });
            }} modifiers={[frame({ width }), padding({ horizontal: 0 })]}>
                <VStack modifiers={[frame({ width })]} spacing={30}>
                    <HStack modifiers={[padding({ horizontal: 20, vertical: 15 })]}>
                        <UIText
                            size={18}
                            weight="semibold"
                        >
                            {editFolder.edit
                                ? `Редактировать папку "${editFolder.oldName}"`
                                : "Создать папку"}
                        </UIText>

                        <Spacer />
                        <Button onPress={() => openCreateFolder(false)} modifiers={[background("rgba(255,255,255,0.25)"), cornerRadius(100)]}>
                            <UIImage systemName="xmark" size={18} modifiers={[padding({ all: 8 })]} />
                        </Button>
                    </HStack>

                    <VStack spacing={10} modifiers={[padding({ horizontal: 20 })]}>
                        <HStack>
                            <UIText>Укажите название</UIText>
                            <Spacer />
                        </HStack>
                        <HStack modifiers={[background(isDarkMode ? '#2d2d2d' : 'white'), frame({ height: 35 }), cornerRadius(10),]}>
                            <UITextField
                                placeholder="Название папки"
                                modifiers={[padding({ vertical: 10, horizontal: 10 })]}
                                onChangeText={setFolderName}
                                defaultValue={editFolder.edit ? editFolder.oldName : ""}
                            />
                        </HStack>
                    </VStack>

                    <ColorPicker
                        label="Цвет папки"
                        selection={colorFolder}
                        onValueChanged={setColorFolder}
                        modifiers={[padding({ horizontal: 20 })]}
                    />

                    <HStack modifiers={[cornerRadius(16)]}>
                        <HStack modifiers={[frame({ height: 80 })]}>
                            <VStack modifiers={[
                                padding({ horizontal: 8, vertical: 4 }),
                                cornerRadius(16),
                                frame({ width: 80, height: 80 }),
                                background(isDarkMode ? '#303034' : 'white'),
                                cornerRadius(16)
                            ]} spacing={5}>
                                <UIImage systemName="folder.fill" size={24} color={colorFolder} modifiers={[shadow({ radius: 2, color: 'black' })]} />
                                <UIText>Папка</UIText>
                            </VStack>
                        </HStack>
                    </HStack>

                    <HStack modifiers={[padding({ horizontal: 10 }), frame({ height: 40 })]}>
                        <Button
                            variant='bordered'
                            onPress={() => {
                                if (folderName.trim().length === 0) return;
                                if (!userId) return;
                                !editFolder.edit
                                    ? createFolder(userId, folderName, colorFolder)
                                    : editAnimeFolder(
                                        userId,
                                        editFolder.oldName,
                                        folderName,
                                        colorFolder
                                    );
                                openCreateFolder(false);
                            }}
                            modifiers={[
                            ]}
                        >
                            {!editFolder.edit ? "Создать папку" : "Изменить папку"}
                        </Button>
                    </HStack>
                </VStack>
            </BottomSheet>
        </Host >
    )
};
