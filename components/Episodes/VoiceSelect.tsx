import React, { memo } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import * as DropdownMenu from 'zeego/dropdown-menu';
import { IconSymbol } from "../ui/IconSymbol";

interface VoiceSelectProps {
    title: string;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

const VoiceSelect = memo((props: VoiceSelectProps) => {
    console.log('render Picker')
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <View style={props.containerStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <IconSymbol name="globe" size={24} color={'white'} />
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Озвучка</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '400' }} numberOfLines={1} // <-- обрезка + троеточие
                            ellipsizeMode="tail">{props.title}</Text>
                        <IconSymbol name='chevron.up.chevron.down' size={14} color={'white'} />
                    </View>
                </View>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Label>Озвучка</DropdownMenu.Label>
                {props.children}
                <DropdownMenu.Separator />
                <DropdownMenu.Arrow />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
})

export default VoiceSelect;