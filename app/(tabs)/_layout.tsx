import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { auth } from '@/lib/firebase';
import { useAnimeStore } from '@/store/animeStore';
import { storage } from '@/utils/storage';
import { Button, ContextMenu, Host, Submenu } from '@expo/ui/swift-ui';
import { Image } from 'expo-image';
import { router, Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
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

const ContextProfile = ({ focused }: { focused: boolean }) => {
    return (
        <Host style={{ width: 25, height: 25 }}>
            <ContextMenu activationMethod='longPress'>
                <ContextMenu.Items>
                    <Button role='destructive' onPress={() => useAnimeStore.getState().clearAnimeMap()}>Очистить AnimeMap</Button>
                    <Submenu
                        key={'settings'}
                        button={
                            <Button systemImage={'gear'}>{'Settings'}</Button>
                        }>
                        <Button
                            onPress={() => router.push({ pathname: '/settings' })}>
                            Настройки
                        </Button>
                        <Button
                            variant="bordered"
                            systemImage="applepencil.and.scribble"
                            onPress={() => router.push({ pathname: '/dev-settings' })}>
                            DEV настройки
                        </Button>
                    </Submenu>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                    <Image source={{ uri: auth.currentUser && auth.currentUser.photoURL || '' }} style={{ width: 25, height: 25, borderRadius: 100, borderWidth: focused ? 1 : 0, borderColor: 'red' }} />
                </ContextMenu.Trigger>
            </ContextMenu>
        </Host>

    )
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const isDefTabs = storage.getDefaultTabBar() ?? false;
    const hideTabName = storage.getUseTitleBottomTabs() ?? true;
    const tabBarShowLabel = isDefTabs ? !hideTabName : false;

    const tabBarIconStyle = isDefTabs
        ? (hideTabName ? { top: 10 } : undefined)
        : { top: 10 };


    if (Platform.Version < '26.0') {
        return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarBackground: () => <TabBarBackground tint='dark' />,
                    tabBarShowLabel,
                    tabBarLabelStyle: { justifyContent: 'center', alignItems: 'center', },
                    tabBarIconStyle,
                    tabBarStyle: !isDefTabs ? {
                        borderRadius: 50, position: 'absolute', alignContent: 'center', overflow: 'hidden', bottom: 20, height: 65, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginHorizontal: 10
                    } :
                        Platform.select({
                            ios: {
                                position: 'absolute',
                            },
                            default: {},
                        })
                }}
            >

                {tabsData.map((tab, i) => (
                    <Tabs.Screen
                        key={`tab-${i}`}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            tabBarIcon: ({ color, focused }) => {
                                if (tab.name === 'profile') {
                                    return auth.currentUser ? <ContextProfile focused={focused} /> : <IconSymbol size={28} name="person.fill" color={color} />
                                }

                                return <IconSymbol size={tab.iconSize} name={tab.icon} color={color} />
                            }
                        }}
                    />
                ))}
            </Tabs>
        );
    }

    return (
        <NativeTabs tintColor={'white'} disableTransparentOnScrollEdge blurEffect='dark'>
            <NativeTabs.Trigger name='(home)'>
                <Label>Главная</Label>
                <Icon sf='house.fill' />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='search'>
                <Label>Поиск</Label>
                <Icon sf='magnifyingglass' />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='profile'>
                <Label>Профиль</Label>
                <Icon sf='person.fill' />
            </NativeTabs.Trigger>
        </NativeTabs>
    )
};
