import { IconSymbol } from '@/components/ui/IconSymbol.ios';
import { CustomTabBar } from '@/components/ui/TabBar/CustomTabBar';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { AnimationSpec } from 'expo-symbols';
import React from 'react';
import { Platform } from 'react-native';
import { SFSymbols6_0 } from 'sf-symbols-typescript';

const iconSize = 28;

type TabsData = {
    name: string;
    title: string;
    icon: SFSymbols6_0;
    iconSize: number;
    color?: string;
    headerLeft?: () => React.ReactNode;
    headerRight?: () => React.ReactNode;
}

const tabsData: TabsData[] = [
    { name: '(home)', title: 'home', icon: 'house.fill', iconSize, color: 'white' },
    { name: 'search', title: 'search', icon: 'magnifyingglass', iconSize, color: 'white' },
    { name: '(news)', title: 'news', icon: 'newspaper', iconSize, color: 'white' },
    { name: 'profile', title: 'profile', icon: 'person.fill', iconSize, color: 'white' },
]

const iconAnimation = { effect: { direction: 'down', type: 'bounce', wholeSymbol: true } } as AnimationSpec

export default function TabLayout() {

    if (Platform.Version < '26.0') {
        return (
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                {tabsData.map((tab, i) => (
                    <Tabs.Screen
                        key={`tab-${i}`}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            tabBarIcon: ({ color, focused }) => {
                                return <IconSymbol
                                    size={tab.iconSize}
                                    name={tab.icon}
                                    color={color}
                                    animationSpec={iconAnimation}
                                />
                            }
                        }}
                    />
                ))}
            </Tabs>
        );
    }

    return (
        <NativeTabs tintColor={'black'} disableTransparentOnScrollEdge blurEffect='dark'>
            <NativeTabs.Trigger name='(home)'>
                <Label selectedStyle={{ color: 'orange', fontSize: 11, fontWeight: '500' }}>Главная</Label>
                <Icon sf='house.fill' selectedColor={'orange'} />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='search'>
                <Label selectedStyle={{ color: 'orange', fontSize: 11, fontWeight: '500' }}>Поиск</Label>
                <Icon sf='magnifyingglass' selectedColor={'orange'} />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='profile'>
                <Label selectedStyle={{ color: 'orange', fontSize: 11, fontWeight: '500' }}>Профиль</Label>
                <Icon sf='person.fill' selectedColor={'orange'} />
            </NativeTabs.Trigger>
        </NativeTabs>
    )
};
