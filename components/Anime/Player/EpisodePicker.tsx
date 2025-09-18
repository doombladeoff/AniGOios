import { DropdownMenu } from "@/components/ContextComponent";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { StyleProp, Text, View, ViewStyle } from "react-native";

interface EpisodePickerProps {
    containerStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    episodesArray: any[];
    voiceOvers: any[];
    selectedEp: number;
    selectedVoiceOver: string;
    onSelectEpisode: (epNumber: number) => void;
    onSelectVoiceOver: (voiceOverId: number) => void;
}

export const EpisodePicker = ({ containerStyle, itemStyle, episodesArray, voiceOvers, selectedEp, selectedVoiceOver, onSelectEpisode, onSelectVoiceOver }: EpisodePickerProps) => {
    return (
        <View>
            <View style={containerStyle || { flexDirection: 'row', alignItems: 'center' }}>
                {episodesArray.length > 0 && (
                    <DropdownMenu
                        label="Серия"
                        triggerItem={
                            <View style={itemStyle}>
                                <Text style={{ color: "white" }}>
                                    Серия {selectedEp}
                                </Text>
                                <IconSymbol name='chevron.up.chevron.down' size={14} color={'skyblue'} />
                            </View>
                        }
                        items={episodesArray.map((ep, index) => ({
                            title: `Серия ${ep.number}`,
                            onSelect: () => onSelectEpisode(ep?.number),
                        }))}
                    />
                )}

                {voiceOvers.length > 0 &&
                    <DropdownMenu
                        label="Озвучка"
                        triggerItem={
                            <View style={itemStyle}>
                                <Text style={{ color: 'white' }}>
                                    {selectedVoiceOver}
                                </Text>
                                <IconSymbol name='chevron.up.chevron.down' size={14} color={'skyblue'} />
                            </View>
                        }
                        items={voiceOvers.map((i, id) => {
                            return {
                                title: i.title,
                                onSelect: () => onSelectVoiceOver(i.id)
                            }
                        })}
                    />
                }
            </View>
        </View>
    )
}