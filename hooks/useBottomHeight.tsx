import { storage } from "@/utils/storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

export const useBottomHeight = () => {
    const isDefaultTabs = storage.getDefaultTabBar() ?? false;

    if (Platform.Version < '26.0') {
        const height = useBottomTabBarHeight();
        const scrollPadBottom = isDefaultTabs ? height - 20 : height;
        return scrollPadBottom;
    }

    return 0;
}