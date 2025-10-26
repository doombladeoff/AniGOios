import { IconSymbol } from '@/components/ui/IconSymbol.ios';
import { CustomTabBar } from '@/components/ui/TabBar/CustomTabBar';
import { Tabs } from 'expo-router';
import { AnimationSpec } from 'expo-symbols';
import React from 'react';
import { Platform } from 'react-native';
import { SFSymbols6_0 } from 'sf-symbols-typescript';

import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationEventMap,
    NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const NativeTab = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof BottomTabNavigator,
    TabNavigationState<ParamListBase>,
    NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

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
    { name: 'home', title: 'home', icon: 'house.fill', iconSize, color: 'white' },
    { name: 'search', title: 'search', icon: 'magnifyingglass', iconSize, color: 'white' },
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
        <NativeTab>
            <NativeTab.Screen
                name="home"
                options={{
                    title: "Главная",
                    tabBarIcon: () => ({ sfSymbol: "house.fill" }),
                    tabBarActiveTintColor: 'orange'
                }}
            />
            <NativeTab.Screen
                name="search"
                options={{
                    title: "Поиск",
                    tabBarIcon: () => ({ sfSymbol: "magnifyingglass" }),
                    tabBarActiveTintColor: 'orange',
                    tabBarLabel: 'Поиск',
                }}
            />
            <NativeTab.Screen
                name="profile"
                options={{
                    title: "Профиль",
                    tabBarIcon: () => ({ sfSymbol: "person.fill" }),
                    tabBarActiveTintColor: 'orange',
                }}
            />
        </NativeTab>
    );
};
