import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'expo-status-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

// Theme providers
import {ThemeProvider, useTheme} from './context/ThemeContext';
import {AppLoadingProvider} from './context/AppLoadingContext';
import {NavigationThemeProvider} from './context/NavigationThemeContext';

const Stack = createNativeStackNavigator();

// Main app navigator
const AppNavigator = () => {
    const {theme, colors} = useTheme();

    // Custom navigation theme
    const navigationTheme = {
        dark: theme === 'dark',
        colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.foreground,
            border: colors.border,
            notification: colors.accentPrimary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    contentStyle: {backgroundColor: colors.background},
                    animation: 'fade_from_bottom',
                    animationDuration: 200,
                    // This prevents the white flash during transitions
                    presentation: 'card',
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="AddRecipe" component={AddRecipeScreen}/>
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// Root component with ThemeProvider
export default function App() {
    return (
        <ThemeProvider>
            <AppLoadingProvider>
                <NavigationThemeProvider>
                    <AppNavigator/>
                </NavigationThemeProvider>
            </AppLoadingProvider>
        </ThemeProvider>
    );
}