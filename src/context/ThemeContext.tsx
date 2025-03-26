import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {createStyles, themeColors, ThemeType} from '../styles';

type ThemeContextType = {
    theme: ThemeType;
    toggleTheme: () => void;
    colors: typeof themeColors.light;
    styles: ReturnType<typeof createStyles>;
};

// Create Context with default values
const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {
    },
    colors: themeColors.light,
    styles: createStyles('light'),
});

// Create Provider component
// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const systemColorScheme = useColorScheme() as ThemeType || 'light';
    const [theme, setTheme] = useState<ThemeType>(systemColorScheme);

    useEffect(() => {
        // Load saved theme preference
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    setTheme(savedTheme as ThemeType);
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme: ThemeType = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    // Get the appropriate colors and styles based on theme
    const colors = themeColors[theme];
    const styles = createStyles(theme);

    return (
        <ThemeContext.Provider value={{theme, toggleTheme, colors, styles}}>
            {children}
        </ThemeContext.Provider>
    );
};