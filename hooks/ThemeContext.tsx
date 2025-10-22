import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { MMKV } from "react-native-mmkv";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
    theme: "light" | "dark";
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const storage = new MMKV();
const STORAGE_KEY = "APP_THEME_MODE";

const ThemeContext = createContext<ThemeContextProps>({
    theme: "light",
    mode: "system",
    setMode: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const getSystemTheme = () => {
        const colorScheme: ColorSchemeName = Appearance.getColorScheme();
        return colorScheme === "dark" ? "dark" : "light";
    };

    useEffect(() => {
        const savedMode = storage.getString(STORAGE_KEY);
        if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
            setModeState(savedMode);
        }
    }, []);

    useEffect(() => {
        if (mode === "system") {
            setTheme(getSystemTheme());
            const listener = Appearance.addChangeListener(({ colorScheme }) => {
                setTheme(colorScheme === "dark" ? "dark" : "light");
            });
            return () => listener.remove();
        } else {
            setTheme(mode);
        }
    }, [mode]);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        storage.set(STORAGE_KEY, newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            <StatusBar
                translucent
                animated
                style={theme === "dark" ? "light" : "dark"}
            />
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
