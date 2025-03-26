import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ingredient, Recipe, Step} from './types';
import {generateUUID} from './uuid';

// Calculate adjusted amount based on servings
export const calculateAmount = (
    amount: string,
    baseServings: string,
    currentServings: number
): string => {
    const baseAmount = Number.parseFloat(amount);
    const base = Number.parseInt(baseServings) || 1;

    if (isNaN(baseAmount)) return amount;

    const adjusted = (baseAmount / base) * currentServings;
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
};

// Save recipe to AsyncStorage
export const saveRecipe = async (recipe: Recipe): Promise<void> => {
    try {
        // Get existing recipes from AsyncStorage
        const savedRecipes = await AsyncStorage.getItem('recipes');
        const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];

        // Add new recipe and save back to AsyncStorage
        await AsyncStorage.setItem('recipes', JSON.stringify([...recipes, recipe]));
    } catch (error) {
        console.error('Failed to save recipe:', error);
        throw new Error('Failed to save recipe. Please try again.');
    }
};

// Update an existing recipe
export const updateRecipe = async (updatedRecipe: Recipe): Promise<void> => {
    try {
        // Get existing recipes from AsyncStorage
        const savedRecipes = await AsyncStorage.getItem('recipes');
        if (!savedRecipes) throw new Error('No recipes found');

        const recipes: Recipe[] = JSON.parse(savedRecipes);

        // Find recipe index
        const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
        if (index === -1) throw new Error('Recipe not found');

        // Update recipe
        recipes[index] = {
            ...updatedRecipe,
            updatedAt: Date.now()
        };

        // Save updated recipes
        await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
    } catch (error) {
        console.error('Failed to update recipe:', error);
        throw new Error('Failed to update recipe. Please try again.');
    }
};

// Delete a recipe
export const deleteRecipe = async (recipeId: string): Promise<void> => {
    try {
        const savedRecipes = await AsyncStorage.getItem('recipes');
        if (!savedRecipes) throw new Error('No recipes found');

        const recipes: Recipe[] = JSON.parse(savedRecipes);
        const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);

        await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    } catch (error) {
        console.error('Failed to delete recipe:', error);
        throw new Error('Failed to delete recipe. Please try again.');
    }
};

// Load all recipes
export const loadRecipes = async (): Promise<Recipe[]> => {
    try {
        const savedRecipes = await AsyncStorage.getItem('recipes');
        return savedRecipes ? JSON.parse(savedRecipes) : [];
    } catch (error) {
        console.error('Failed to load recipes:', error);
        throw new Error('Failed to load recipes. Please try again.');
    }
};

// Load a specific recipe by ID
export const loadRecipeById = async (recipeId: string): Promise<Recipe | null> => {
    try {
        const savedRecipes = await AsyncStorage.getItem('recipes');
        if (!savedRecipes) return null;

        const recipes: Recipe[] = JSON.parse(savedRecipes);
        return recipes.find(recipe => recipe.id === recipeId) || null;
    } catch (error) {
        console.error('Failed to load recipe:', error);
        throw new Error('Failed to load recipe. Please try again.');
    }
};

// Create a new recipe object
export const createNewRecipe = (
    name: string,
    ingredients: Ingredient[],
    steps: Step[],
    baseServings: string,
    prepTime: string,
    cookTime: string,
    image?: string
): Recipe => {
    return {
        id: generateUUID(),
        name: name.trim(),
        ingredients,
        steps,
        baseServings: baseServings.trim(),
        prepTime: prepTime.trim(),
        cookTime: cookTime.trim(),
        image,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};