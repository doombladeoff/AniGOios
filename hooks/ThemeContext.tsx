import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { MMKV } from "react-native-mmkv";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
    theme: "light" | "dark";
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const storage = new MMKV();
const STORAGE_KEY = "APP_THEME_MODE";

const initialMode = (storage.getString(STORAGE_KEY) as ThemeMode) || "system";

const getSystemTheme = (): "light" | "dark" => {
    const colorScheme: ColorSchemeName = Appearance.getColorScheme();
    return colorScheme === "dark" ? "dark" : "light";
};

const initialTheme = initialMode === "system" ? getSystemTheme() : initialMode;

const ThemeContext = createContext<ThemeContextProps>({
    theme: "light",
    mode: "system",
    setMode: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>(initialMode);
    const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

    useEffect(() => {
        if (mode === "system") {
            const listener = Appearance.addChangeListener(({ colorScheme }) => {
                setTheme(colorScheme === "dark" ? "dark" : "light");
            });
            return () => listener.remove();
        }
    }, [mode]);

    useEffect(() => {
        if (mode !== "system") {
            setTheme(mode);
        } else {
            setTheme(getSystemTheme());
        }
    }, [mode]);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        storage.set(STORAGE_KEY, newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            <StatusBar translucent animated style={theme === "dark" ? "light" : "dark"} />
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
