import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import {useNavigationTheme} from '../context/NavigationThemeContext';
import {Recipe} from '../utils/types';
import {loadRecipes} from '../utils/recipeUtils';

// Components
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import ThemeSettings from '../components/ThemeSettings';

// TODO: Central navigation types file
export default function HomeScreen({navigation}) {
    const {theme, styles, colors} = useTheme();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [showThemeOptions, setShowThemeOptions] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const loadedRecipes = await loadRecipes();
                setRecipes(loadedRecipes);
            } catch (error) {
                console.error('Failed to load recipes:', error);
            }
        };

        // Initial load
        fetchRecipes();

        // Add event listener for when the screen comes into focus
        const unsubscribe = navigation.addListener('focus', fetchRecipes);

        // Clean up listener on unmount
        return unsubscribe;
    }, [navigation]);

    const handleRecipePress = (recipeId: string) => {
        navigation.navigate('RecipeDetail', {recipeId});
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Feather name="book-open" size={64} color={colors.icon}/>
            <Text style={styles.emptyText}>
                No recipes yet. Tap the + button to add your first recipe!
            </Text>
        </View>
    );

    const {containerStyle} = useNavigationTheme();

    return (
        <SafeAreaView style={[styles.safeArea, containerStyle]}>
            <View style={styles.container}>
                <Header
                    title="Your Recipes"
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => setShowThemeOptions(!showThemeOptions)}
                            style={styles.iconButton}
                        >
                            <Feather
                                name={theme === 'dark' ? 'sun' : 'moon'}
                                size={24}
                                color={colors.foreground}
                            />
                        </TouchableOpacity>
                    }
                />

                {/* Theme Options Panel */}
                {showThemeOptions && (
                    <ThemeSettings onClose={() => setShowThemeOptions(false)}/>
                )}

                {recipes.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={({item}) => (
                            <RecipeCard
                                recipe={item}
                                onPress={() => handleRecipePress(item.id)}
                            />
                        )}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 100}}
                    />
                )}

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddRecipe')}
                >
                    <Feather name="plus" size={24} color={colors.accentForeground}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}