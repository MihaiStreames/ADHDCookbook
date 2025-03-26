import React, {createContext, useContext, useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useTheme} from './ThemeContext';

// Create context with default value
type AppLoadingContextType = {
    isLoading: boolean;
};

const AppLoadingContext = createContext<AppLoadingContextType>({
    isLoading: true,
});

// Custom hook to use the loading context
export const useAppLoading = () => useContext(AppLoadingContext);

// Provider component
export const AppLoadingProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const {theme, colors} = useTheme();

    useEffect(() => {
        // Simulate a brief loading delay to ensure theme is properly loaded
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        // Show a loading screen that matches the current theme
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                }}
            >
                <StatusBar
                    barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                    backgroundColor={colors.background}
                />
            </View>
        );
    }

    return (
        <AppLoadingContext.Provider value={{isLoading}}>
            {children}
        </AppLoadingContext.Provider>
    );
};

export default AppLoadingContext;