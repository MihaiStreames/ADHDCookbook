import React, {useEffect, useState} from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import type {Ingredient, Recipe, Step} from '../types';
import CheckBox from 'expo-checkbox';

export default function RecipeDetailScreen({route, navigation}) {
    const {recipeId} = route.params;
    const {theme, toggleTheme} = useTheme();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            paddingHorizontal: 16,
            paddingBottom: 24,
        },
        safeArea: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 16,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#000000',
            marginLeft: 12,
            flex: 1,
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 16,
        },
        timeInfo: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 16,
        },
        timeItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        timeText: {
            fontSize: 14,
            color: isDark ? '#bbbbbb' : '#666666',
            marginLeft: 4,
        },
        servingsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#333333' : '#f1f1f1',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
        },
        servingsLabel: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        servingsText: {
            fontSize: 16,
            fontWeight: '500',
            color: isDark ? '#ffffff' : '#000000',
            marginLeft: 8,
        },
        servingsControls: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        servingsButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isDark ? '#444444' : '#e0e0e0',
            justifyContent: 'center',
            alignItems: 'center',
        },
        servingsValue: {
            width: 32,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '500',
            color: isDark ? '#ffffff' : '#000000',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '500',
            color: isDark ? '#ffffff' : '#000000',
            marginBottom: 12,
        },
        ingredientItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        ingredientText: {
            fontSize: 16,
            color: isDark ? '#ffffff' : '#000000',
            marginLeft: 12,
            flex: 1,
        },
        ingredientTextChecked: {
            textDecorationLine: 'line-through',
            color: isDark ? '#888888' : '#999999',
        },
        ingredientAmount: {
            color: isDark ? '#bbbbbb' : '#666666',
        },
        stepContainer: {
            backgroundColor: isDark ? '#333333' : '#f1f1f1',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
        },
        stepContainerChecked: {
            backgroundColor: isDark ? '#2a2a2a' : '#e8e8e8',
        },
        stepContent: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        stepText: {
            fontSize: 16,
            color: isDark ? '#ffffff' : '#000000',
            marginLeft: 12,
            flex: 1,
        },
        stepTextChecked: {
            textDecorationLine: 'line-through',
            color: isDark ? '#888888' : '#999999',
        },
        linkedIngredients: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: 28,
            marginTop: 8,
            gap: 8,
        },
        ingredientBadge: {
            backgroundColor: isDark ? '#444444' : '#e0e0e0',
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        ingredientBadgeChecked: {
            opacity: 0.5,
        },
        ingredientBadgeText: {
            fontSize: 12,
            color: isDark ? '#ffffff' : '#000000',
        },
        ingredientBadgeTextChecked: {
            textDecorationLine: 'line-through',
        },
        section: {
            marginBottom: 24,
        },
    });

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
                },
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
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Feather name="arrow-left" size={24} color={isDark ? '#ffffff' : '#000000'}/>
                            </TouchableOpacity>
                            <Text style={styles.title}>Recipe Not Found</Text>
                        </View>
                        <TouchableOpacity onPress={toggleTheme}>
                            <Feather
                                name={isDark ? 'sun' : 'moon'}
                                size={24}
                                color={isDark ? '#ffffff' : '#000000'}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{color: isDark ? '#ffffff' : '#000000'}}>
                        The recipe you're looking for doesn't exist.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color={isDark ? '#ffffff' : '#000000'}/>
                        </TouchableOpacity>
                        <Text style={styles.title} numberOfLines={1}>{recipe.name}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={toggleTheme} style={{marginRight: 16}}>
                            <Feather
                                name={isDark ? 'sun' : 'moon'}
                                size={24}
                                color={isDark ? '#ffffff' : '#000000'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Feather name="trash-2" size={24} color="#ff4040"/>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {recipe.image && (
                        <Image source={{uri: recipe.image}} style={styles.image} resizeMode="cover"/>
                    )}

                    <View style={styles.timeInfo}>
                        {recipe.prepTime && (
                            <View style={styles.timeItem}>
                                <Feather name="clock" size={16} color={isDark ? '#bbbbbb' : '#666666'}/>
                                <Text style={styles.timeText}>Prep: {recipe.prepTime} min</Text>
                            </View>
                        )}
                        {recipe.cookTime && (
                            <View style={styles.timeItem}>
                                <Feather name="clock" size={16} color={isDark ? '#bbbbbb' : '#666666'}/>
                                <Text style={styles.timeText}>Cook: {recipe.cookTime} min</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.servingsContainer}>
                        <View style={styles.servingsLabel}>
                            <Feather name="users" size={20} color={isDark ? '#bbbbbb' : '#666666'}/>
                            <Text style={styles.servingsText}>Servings</Text>
                        </View>
                        <View style={styles.servingsControls}>
                            <TouchableOpacity
                                style={styles.servingsButton}
                                onPress={() => adjustServings(-1)}
                                disabled={servings <= 1}
                            >
                                <Feather name="minus" size={16} color={isDark ? '#ffffff' : '#000000'}/>
                            </TouchableOpacity>
                            <Text style={styles.servingsValue}>{servings}</Text>
                            <TouchableOpacity
                                style={styles.servingsButton}
                                onPress={() => adjustServings(1)}
                            >
                                <Feather name="plus" size={16} color={isDark ? '#ffffff' : '#000000'}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {ingredients.map((ingredient) => (
                            <View key={ingredient.id} style={styles.ingredientItem}>
                                <CheckBox
                                    value={ingredient.checked}
                                    onValueChange={() => toggleIngredientChecked(ingredient.id)}
                                    color={ingredient.checked ? (isDark ? '#0070f3' : '#0070f3') : undefined}
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

                    <View style={styles.section}>
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
                                        color={step.checked ? (isDark ? '#0070f3' : '#0070f3') : undefined}
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