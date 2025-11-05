import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomTabNavigationEventMap, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, NavigationRoute, ParamListBase } from "@react-navigation/native";
import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { HapticTab } from "./HapticTab";
import { UserTab } from "./UserTab";

interface TabItemProps {
    route: NavigationRoute<ParamListBase, string>;
    isFocused: boolean;
    options: BottomTabNavigationOptions;
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
}

function TabItem({ route, isFocused, options, navigation }: TabItemProps) {
    const colorScheme = useColorScheme();
    const themeColors = useMemo(() => Colors[colorScheme ?? 'dark'], [colorScheme]);
    const isDarkMode = useTheme().theme === 'dark';

    const iconColor = isFocused ? isDarkMode ? 'white' : 'black' : themeColors.tabIconDefault;

    const onPress = () => {
        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    return (
        <HapticTab onPress={onPress} style={styles.tabContainer}>
            {options.tabBarIcon && route.name !== "profile" ? (
                options.tabBarIcon({
                    focused: isFocused,
                    color: iconColor,
                    size: 24,
                })
            ) : (
                <UserTab color={iconColor} />
            )}
        </HapticTab>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    }
})

export default memo(TabItem);
