import { BottomSheet, Button, ContextMenu, Host, HStack, Spacer, Image as UIImage, Switch as UISwitch, Text as UIText, VStack } from "@expo/ui/swift-ui";
import { background, cornerRadius, fixedSize, frame, padding } from "@expo/ui/swift-ui/modifiers";
import { memo } from "react";
import { useWindowDimensions } from "react-native";

const transpaletSort = {
    desc: "По новизне",
    asc: "Сначала старые",
};

export type OrderT = 'desc' | 'asc'

interface FiltersProps {
    isOpened: boolean;
    onOpen: (v: boolean) => void;
    setOrderType: (v: OrderT) => void;
    onSwitchValueChange: (v: any) => void;
    switchArr: any[];
    orderType: 'desc' | 'asc';
}

const Filters = ({ isOpened, onOpen, setOrderType, onSwitchValueChange, switchArr, orderType }: FiltersProps) => {
    const { width } = useWindowDimensions();

    return (
        <Host style={{ position: 'absolute', width }}>
            <BottomSheet isOpened={isOpened} onIsOpenedChange={(e) => onOpen(e)} modifiers={[fixedSize(true)]}>
                <VStack modifiers={[padding({ all: 20 })]} spacing={30}>
                    <HStack>
                        <UIText weight="bold" size={18}>
                            Фильтры
                        </UIText>
                        <Spacer />
                        <Button onPress={() => onOpen(false)} modifiers={[background('rgba(80,80,80,0.5)'), cornerRadius(100)]}>
                            <UIImage systemName="xmark" size={18} modifiers={[padding({ all: 10 })]} />
                        </Button>
                    </HStack>

                    <HStack modifiers={[padding({ horizontal: 5 })]}>
                        <UIText>
                            Сортировать по
                        </UIText>
                        <Spacer />
                        <HStack>
                            <ContextMenu>
                                <ContextMenu.Items>
                                    {[
                                        { title: "По новизне", onSelect: () => setOrderType("desc") },
                                        { title: "Сначала старые", onSelect: () => setOrderType("asc") },
                                    ].map((item, index) => (
                                        <Button onPress={() => item.onSelect()}>
                                            {item.title}
                                        </Button>
                                    ))}
                                </ContextMenu.Items>
                                <ContextMenu.Trigger>
                                    <HStack alignment='center' modifiers={[background("rgba(80,80,80,0.6)"), cornerRadius(8), frame({ width: 125, height: 30 })]}>
                                        <HStack modifiers={[padding({ vertical: 2, horizontal: 4 }), cornerRadius(100)]}>
                                            <UIText color="white" modifiers={[frame({ width: 100, height: 30 })]} >
                                                {transpaletSort[orderType].toString()}
                                            </UIText>
                                            <UIImage systemName="chevron.up.chevron.down" size={16} modifiers={[padding({ all: 6 })]} />
                                        </HStack>
                                    </HStack>
                                </ContextMenu.Trigger>
                            </ContextMenu>
                        </HStack>
                    </HStack>

                    <VStack spacing={15}>
                        <HStack modifiers={[padding({ horizontal: 10 })]}>
                            <UIText size={18} weight="bold">Показать</UIText>
                            <Spacer />
                        </HStack>
                        <VStack modifiers={[background('rgba(80,80,80,0.65)'), cornerRadius(10)]}>
                            <VStack spacing={20} modifiers={[padding({ all: 10 })]}>
                                {
                                    // [
                                    //     { value: filterShow.showPlanned, label: 'В планах', type: 'showPlanned' },
                                    //     { value: filterShow.showCompleted, label: 'Просмотренные', type: 'showCompleted' },
                                    //     { value: filterShow.showWatching, label: 'Смотрю', type: 'showWatching' },

                                    // ]

                                    switchArr.map((item, index) => (
                                        <UISwitch key={item.type}
                                            value={item.value}
                                            onValueChange={() => onSwitchValueChange(item.type as "showPlanned" | "showCompleted" | "showWatching")}
                                            label={item.label}
                                        />
                                    ))
                                }
                            </VStack>
                        </VStack>
                    </VStack>
                </VStack>
            </BottomSheet>
        </Host>
    )
}

export default memo(Filters)