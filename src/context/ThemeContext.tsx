import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {createStyles, themeColors, ThemeType} from '../utils/styles';

type ThemeContextType = {
    theme: ThemeType;
    toggleTheme: () => void;
    colors: typeof themeColors.light;
    styles: ReturnType<typeof createStyles>;
    setThemeManually: (theme: ThemeType) => void;
    isUsingDeviceTheme: boolean;
    setUseDeviceTheme: (useDevice: boolean) => void;
};

// Create Context with default values
const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {
    },
    colors: themeColors.dark,
    styles: createStyles('dark'),
    setThemeManually: () => {
    },
    isUsingDeviceTheme: true,
    setUseDeviceTheme: () => {
    },
});

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const systemColorScheme = useColorScheme() as ThemeType || 'dark';
    const [theme, setTheme] = useState<ThemeType>('dark');
    const [isUsingDeviceTheme, setIsUsingDeviceTheme] = useState(true);

    useEffect(() => {
        // Load saved theme preference
        const loadTheme = async () => {
            try {
                const useDeviceTheme = await AsyncStorage.getItem('useDeviceTheme');

                // Default to using device theme
                if (useDeviceTheme === null || useDeviceTheme === 'true') {
                    setIsUsingDeviceTheme(true);
                    setTheme(systemColorScheme);
                } else {
                    setIsUsingDeviceTheme(false);
                    const savedTheme = await AsyncStorage.getItem('theme') || 'dark';
                    if (savedTheme === 'light' || savedTheme === 'dark') {
                        setTheme(savedTheme as ThemeType);
                    }
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
                // Default to dark theme if there's an error
                setTheme('dark');
            }
        };

        loadTheme();
    }, [systemColorScheme]);

    // Listen for device theme changes when using device theme
    useEffect(() => {
        if (isUsingDeviceTheme) {
            setTheme(systemColorScheme);
        }
    }, [isUsingDeviceTheme, systemColorScheme]);

    const toggleTheme = async () => {
        if (isUsingDeviceTheme) {
            // If currently using device theme, switch to manual and toggle
            setIsUsingDeviceTheme(false);
            const newTheme: ThemeType = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            try {
                await AsyncStorage.setItem('useDeviceTheme', 'false');
                await AsyncStorage.setItem('theme', newTheme);
            } catch (error) {
                console.error('Failed to save theme preference:', error);
            }
        } else {
            // If manually set, just toggle the theme
            const newTheme: ThemeType = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            try {
                await AsyncStorage.setItem('theme', newTheme);
            } catch (error) {
                console.error('Failed to save theme preference:', error);
            }
        }
    };

    const setThemeManually = async (newTheme: ThemeType) => {
        setIsUsingDeviceTheme(false);
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('useDeviceTheme', 'false');
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const setUseDeviceTheme = async (useDevice: boolean) => {
        setIsUsingDeviceTheme(useDevice);
        if (useDevice) {
            setTheme(systemColorScheme);
        }
        try {
            await AsyncStorage.setItem('useDeviceTheme', useDevice ? 'true' : 'false');
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    // Get the appropriate colors and styles based on theme
    const colors = themeColors[theme];
    const styles = createStyles(theme);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                colors,
                styles,
                setThemeManually,
                isUsingDeviceTheme,
                setUseDeviceTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};