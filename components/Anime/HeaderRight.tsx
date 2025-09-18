import { storage } from "@/utils/storage"
import { router } from "expo-router"
import { View } from "react-native"
import { DropdownMenu } from "../ContextComponent"
import { Items } from "../ContextComponent/ContextMenu"
import { IconSymbol } from "../ui/IconSymbol"

interface HeaderRightProps {
    img?: { crunch: string | undefined, def: string | undefined };
    customItems?: Items[]
}
export const HeaderRight = ({ img, customItems }: HeaderRightProps) => {
    return (
        <DropdownMenu
            triggerItem={
                <View hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.85, shadowRadius: 6 }}>
                    <IconSymbol name='ellipsis.circle.fill' size={24} color={'white'} />
                </View>
            }
            items={[
                ...(__DEV__ ? [{
                    title: 'Очистить данные',
                    onSelect: () => storage.clearALL(),
                }] : []),
                {
                    title: 'Редактировать постер',
                    onSelect: () => router.push({
                        pathname: '/(screens)/(settings)/(edit)/posterEditor',
                        params: { src: JSON.stringify(img) },
                    })
                },
                ...(customItems ?? [])
            ]}
        />
        // <ContextMenu.Root>
        //     <ContextMenu.Trigger>
        //         <View hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.85, shadowRadius: 6 }}>
        //             <IconSymbol name='ellipsis.circle.fill' size={24} color={'white'} />
        //         </View>
        //     </ContextMenu.Trigger>
        //     <ContextMenu.Content>
        //         <ContextMenu.Item key="deleteALl" onSelect={() => storage.clearALL()}>
        //             <ContextMenu.ItemTitle>Очистить данные</ContextMenu.ItemTitle>
        //         </ContextMenu.Item>
        //         <ContextMenu.Item key="goto1" onSelect={() => router.push({ pathname: '/(screens)/(settings)/posterEditor', params: { src: JSON.stringify(img) } })}>
        //             <ContextMenu.ItemTitle>Редакитровать постер</ContextMenu.ItemTitle>
        //         </ContextMenu.Item>
        //     </ContextMenu.Content>
        // </ContextMenu.Root>
    )

}