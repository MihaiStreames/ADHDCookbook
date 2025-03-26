import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import type {Ingredient, Recipe, Step} from '../utils/types';
import CheckBox from 'expo-checkbox';

export default function RecipeDetailScreen({route, navigation}) {
    const {recipeId} = route.params;
    const {styles, colors} = useTheme();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const savedRecipes = await AsyncStorage.getItem('recipes');
                if (savedRecipes) {
                    const recipes = JSON.parse(savedRecipes);
                    const foundRecipe = recipes.find((r: Recipe) => r.id === recipeId);
                    if (foundRecipe) {
                        setRecipe(foundRecipe);
                        setIngredients(
                            foundRecipe.ingredients.map((i: Ingredient) => ({...i, checked: false}))
                        );
                        setSteps(
                            foundRecipe.steps.map((s: Step) => ({...s, checked: false}))
                        );
                        setServings(Number.parseInt(foundRecipe.baseServings) || 1);
                    }
                }
            } catch (error) {
                console.error('Failed to load recipe:', error);
            }
        };
        loadRecipe();
    }, [recipeId]);

    const handleDelete = async () => {
        Alert.alert(
            'Delete Recipe',
            'Are you sure you want to delete this recipe? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const savedRecipes = await AsyncStorage.getItem('recipes');
                            if (savedRecipes) {
                                const recipes = JSON.parse(savedRecipes);
                                const updatedRecipes = recipes.filter((r: Recipe) => r.id !== recipeId);
                                await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
                                navigation.goBack();
                            }
                        } catch (error) {
                            console.error('Failed to delete recipe:', error);
                        }
                    },
                }
            ]
        );
    };

    const adjustServings = (delta: number) => {
        const newServings = Math.max(1, servings + delta);
        setServings(newServings);
    };

    const toggleIngredientChecked = (id: string) => {
        setIngredients(
            ingredients.map((ingredient) =>
                ingredient.id === id
                    ? {...ingredient, checked: !ingredient.checked}
                    : ingredient
            )
        );
    };

    const toggleStepChecked = (id: string) => {
        setSteps(
            steps.map((step) =>
                step.id === id ? {...step, checked: !step.checked} : step
            )
        );
    };

    // Calculate adjusted amount based on servings
    const calculateAmount = (amount: string, baseServings: string) => {
        const baseAmount = Number.parseFloat(amount);
        const base = Number.parseInt(baseServings) || 1;
        if (isNaN(baseAmount)) return amount;
        const adjusted = (baseAmount / base) * servings;
        return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
    };

    if (!recipe) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.containerWithPadding}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                                <Feather name="arrow-left" size={24} color={colors.foreground}/>
                            </TouchableOpacity>
                            <Text style={styles.smallTitle}>Recipe Not Found</Text>
                        </View>
                    </View>
                    <Text style={styles.bodyText}>
                        The recipe you're looking for doesn't exist.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.containerWithPadding}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                            <Feather name="arrow-left" size={24} color={colors.foreground}/>
                        </TouchableOpacity>
                        <Text style={styles.smallTitle} numberOfLines={1}>{recipe.name}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                            <Feather name="trash-2" size={24} color={colors.destructive}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {recipe.image && (
                        <Image source={{uri: recipe.image}} style={styles.imagePreview} resizeMode="cover"/>
                    )}
                    <View style={{flexDirection: 'row', gap: 24, marginVertical: 16}}>
                        {recipe.prepTime && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Feather name="clock" size={16} color={colors.mutedForeground}/>
                                <Text style={styles.mutedText}>Prep: {recipe.prepTime} min</Text>
                            </View>
                        )}
                        {recipe.cookTime && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Feather name="clock" size={16} color={colors.mutedForeground}/>
                                <Text style={styles.mutedText}>Cook: {recipe.cookTime} min</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.servingsContainer}>
                        <View style={styles.servingsLabel}>
                            <Feather name="users" size={20} color={colors.mutedForeground}/>
                            <Text style={styles.servingsText}>Servings</Text>
                        </View>
                        <View style={styles.servingsControls}>
                            <TouchableOpacity
                                style={styles.servingsButton}
                                onPress={() => adjustServings(-1)}
                                disabled={servings <= 1}
                            >
                                <Feather
                                    name="minus"
                                    size={16}
                                    color={servings <= 1 ? colors.disabledIcon : colors.foreground}
                                />
                            </TouchableOpacity>
                            <Text style={styles.servingsValue}>{servings}</Text>
                            <TouchableOpacity
                                style={styles.servingsButton}
                                onPress={() => adjustServings(1)}
                            >
                                <Feather name="plus" size={16} color={colors.foreground}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {ingredients.map((ingredient) => (
                            <View key={ingredient.id} style={styles.ingredientCheckItem}>
                                <CheckBox
                                    value={ingredient.checked}
                                    onValueChange={() => toggleIngredientChecked(ingredient.id)}
                                    color={ingredient.checked ? colors.accent : undefined}
                                />
                                <Text
                                    style={[
                                        styles.ingredientText,
                                        ingredient.checked && styles.ingredientTextChecked,
                                    ]}
                                >
                                    <Text style={{fontWeight: '500'}}>{ingredient.name}</Text>
                                    {(ingredient.amount || ingredient.unit) && (
                                        <Text style={styles.ingredientAmount}>
                                            {' '}({calculateAmount(ingredient.amount, recipe.baseServings)} {ingredient.unit})
                                        </Text>
                                    )}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {steps.map((step, index) => (
                            <View
                                key={step.id}
                                style={[
                                    styles.stepContainer,
                                    step.checked && styles.stepContainerChecked,
                                ]}
                            >
                                <View style={styles.stepContent}>
                                    <CheckBox
                                        value={step.checked}
                                        onValueChange={() => toggleStepChecked(step.id)}
                                        color={step.checked ? colors.accent : undefined}
                                    />
                                    <Text
                                        style={[
                                            styles.stepText,
                                            step.checked && styles.stepTextChecked,
                                        ]}
                                    >
                                        <Text style={{fontWeight: '500'}}>{index + 1}. </Text>
                                        {step.instruction}
                                    </Text>
                                </View>

                                {/* Display step image if available */}
                                {step.stepImage && (
                                    <View style={styles.stepImageContainer}>
                                        <Image
                                            source={{uri: step.stepImage}}
                                            style={styles.stepImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}

                                {step.linkedIngredientIds.length > 0 && (
                                    <View style={styles.linkedIngredients}>
                                        {step.linkedIngredientIds.map((id) => {
                                            const ingredient = ingredients.find((i) => i.id === id);
                                            return ingredient ? (
                                                <View
                                                    key={id}
                                                    style={[
                                                        styles.ingredientBadge,
                                                        ingredient.checked && styles.ingredientBadgeChecked,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.ingredientBadgeText,
                                                            ingredient.checked && styles.ingredientBadgeTextChecked,
                                                        ]}
                                                    >
                                                        {ingredient.name}
                                                        {(ingredient.amount || ingredient.unit) && (
                                                            <Text>
                                                                {' '}({calculateAmount(ingredient.amount, recipe.baseServings)} {ingredient.unit})
                                                            </Text>
                                                        )}
                                                    </Text>
                                                </View>
                                            ) : null;
                                        })}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}