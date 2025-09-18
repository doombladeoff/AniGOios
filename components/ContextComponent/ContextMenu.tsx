import { ImageSymbolScale } from 'react-native-ios-utilities';
import { SFSymbols6_0 } from 'sf-symbols-typescript';
import * as ContextMenuUI from 'zeego/context-menu';

export type Items = {
    title: string;
    iconName?: SFSymbols6_0;
    iconColor?: string;
    onSelect?: () => void;
    iconScale?: ImageSymbolScale | undefined;
    destructive?: boolean;
}

export type SubTrigger = {
    title: string;
    items: Items[]
}

export interface ContextMenuProps {
    triggerItem: React.ReactNode;
    previewItem?: React.ReactNode;
    items: Items[];
    subTrigger?: SubTrigger[]
}

const ContextMenu = (props: ContextMenuProps) => {
    return (
        <ContextMenuUI.Root>
            <ContextMenuUI.Trigger>
                {props.triggerItem}
            </ContextMenuUI.Trigger>

            <ContextMenuUI.Content contentEditable>

                {props.previewItem &&
                    <ContextMenuUI.Preview>
                        {props.previewItem}
                    </ContextMenuUI.Preview>
                }

                {props.items.map((itm, index) => (
                    <ContextMenuUI.Item key={`itm-${index}-key`} onSelect={() => itm?.onSelect ? itm.onSelect() : null} destructive={itm?.destructive}>
                        <ContextMenuUI.ItemTitle>{itm.title}</ContextMenuUI.ItemTitle>
                        {itm.iconName &&
                            <ContextMenuUI.ItemIcon
                                ios={{
                                    name: itm.iconName,
                                    paletteColors: [{
                                        dark: itm.iconColor || 'white',
                                        light: itm.iconColor || 'white'
                                    }]
                                }}
                            />
                        }
                    </ContextMenuUI.Item>
                ))}

                <ContextMenuUI.Sub>
                    {props.subTrigger?.map((itm, index) =>
                        <ContextMenuUI.SubTrigger key={`sub-trigger-${itm.title}-${index}`}>
                            <ContextMenuUI.ItemTitle>{itm.title}</ContextMenuUI.ItemTitle>
                        </ContextMenuUI.SubTrigger>
                    )}

                    <ContextMenuUI.SubContent>
                        {props.subTrigger?.map((itm, index) =>
                            itm.items.map((itm2, index) =>
                                <ContextMenuUI.Item key={`sub-time-${itm2.title}`} onSelect={() => itm2?.onSelect ? itm2.onSelect() : console.log('sub')}>
                                    <ContextMenuUI.ItemTitle>{itm2.title}</ContextMenuUI.ItemTitle>
                                    {itm2.iconName &&
                                        <ContextMenuUI.ItemIcon
                                            ios={{
                                                name: itm2.iconName,
                                                paletteColors: [{
                                                    dark: itm2.iconColor || 'white',
                                                    light: itm2.iconColor || 'white'
                                                }],
                                                scale: itm2.iconScale || 'default'
                                            }}
                                        />
                                    }
                                </ContextMenuUI.Item>
                            )
                        )}

                    </ContextMenuUI.SubContent>
                </ContextMenuUI.Sub>
            </ContextMenuUI.Content>

        </ContextMenuUI.Root>
    )
}

export default ContextMenu;