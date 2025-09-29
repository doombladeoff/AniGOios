import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

export const useBottomHeight = () => {

    if (Platform.Version < '26.0') {
        const height = useBottomTabBarHeight();
        return height - 20;
    }

    return 0;
}