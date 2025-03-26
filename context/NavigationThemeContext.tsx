import React, {createContext, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from './ThemeContext';

// Create context
type NavigationThemeContextType = {
    containerStyle: {
        backgroundColor: string;
    };
};

const NavigationThemeContext = createContext<NavigationThemeContextType>({
    containerStyle: {backgroundColor: '#FFFFFF'}
});

// Custom hook to use the navigation theme context
export const useNavigationTheme = () => useContext(NavigationThemeContext);

// Provider component
export const NavigationThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {colors} = useTheme();

    // This will be passed to screens to ensure consistent background color during transitions
    const containerStyle = {
        backgroundColor: colors.background
    };

    return (
        <NavigationThemeContext.Provider value={{containerStyle}}>
            <View style={[styles.container, containerStyle]}>
                {children}
            </View>
        </NavigationThemeContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default NavigationThemeContext;