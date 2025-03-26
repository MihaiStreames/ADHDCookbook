import React, {useEffect, useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import type {Recipe} from '../types';

export default function HomeScreen({navigation}) {
    const {theme, toggleTheme, styles, colors} = useTheme();
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const savedRecipes = await AsyncStorage.getItem('recipes');
                if (savedRecipes) {
                    setRecipes(JSON.parse(savedRecipes));
                }
            } catch (error) {
                console.error('Failed to load recipes:', error);
            }
        };

        // Initial load
        loadRecipes();

        // Add event listener for when the screen comes into focus
        const unsubscribe = navigation.addListener('focus', loadRecipes);

        // Clean up listener on unmount
        return unsubscribe;
    }, [navigation]);

    const renderRecipeCard = ({item}: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', {recipeId: item.id})}
        >
            <View style={styles.recipeImageContainer}>
                {item.image ? (
                    <Image source={{uri: item.image}} style={styles.recipeImage} resizeMode="cover"/>
                ) : (
                    <View style={[styles.recipeImage, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Feather name="image" size={40} color={colors.icon}/>
                    </View>
                )}
            </View>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <View style={styles.recipeDetails}>
                    {item.prepTime && (
                        <View style={styles.recipeDetail}>
                            <Feather name="clock" size={14} color={colors.mutedForeground}/>
                            <Text style={styles.recipeDetailText}>Prep: {item.prepTime} min</Text>
                        </View>
                    )}
                    {item.cookTime && (
                        <View style={styles.recipeDetail}>
                            <Feather name="clock" size={14} color={colors.mutedForeground}/>
                            <Text style={styles.recipeDetailText}>Cook: {item.cookTime} min</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Recipes</Text>
                    <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                        <Feather
                            name={theme === 'dark' ? 'sun' : 'moon'}
                            size={24}
                            color={colors.foreground}
                        />
                    </TouchableOpacity>
                </View>

                {recipes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Feather name="book-open" size={64} color={colors.icon}/>
                        <Text style={styles.emptyText}>
                            No recipes yet. Tap the + button to add your first recipe!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={renderRecipeCard}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 100}}
                    />
                )}

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddRecipe')}
                >
                    <Feather name="plus" size={24} color={colors.accentBlue}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}