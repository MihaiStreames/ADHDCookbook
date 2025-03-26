import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../context/ThemeContext';
import {useNavigationTheme} from '../context/NavigationThemeContext';
import {Ingredient, Recipe, Step} from '../utils/types';
import {deleteRecipe, loadRecipeById} from '../utils/recipeUtils';

// Components
import Header from '../components/Header';
import IngredientList from '../components/IngredientList';
import StepList from '../components/StepList';
import ServingsControl from '../components/ServingsControl';

export default function RecipeDetailScreen({route, navigation}) {
    const {recipeId} = route.params;
    const {styles, colors} = useTheme();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const loadedRecipe = await loadRecipeById(recipeId);
                if (loadedRecipe) {
                    setRecipe(loadedRecipe);
                    setIngredients(
                        loadedRecipe.ingredients.map((i: Ingredient) => ({...i, checked: false}))
                    );
                    setSteps(
                        loadedRecipe.steps.map((s: Step) => ({...s, checked: false}))
                    );
                    setServings(Number.parseInt(loadedRecipe.baseServings) || 1);
                }
            } catch (error) {
                console.error('Failed to load recipe:', error);
                Alert.alert('Error', 'Failed to load recipe details.');
            }
        };

        fetchRecipe();
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
                            await deleteRecipe(recipeId);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Failed to delete recipe:', error);
                            Alert.alert('Error', 'Failed to delete recipe. Please try again.');
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

    const {containerStyle} = useNavigationTheme();

    if (!recipe) {
        return (
            <SafeAreaView style={[styles.safeArea, containerStyle]}>
                <View style={styles.containerWithPadding}>
                    <Header
                        title="Recipe Not Found"
                        showBackButton
                        onBackPress={() => navigation.goBack()}
                    />
                    <Text style={styles.bodyText}>
                        The recipe you're looking for doesn't exist.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, containerStyle]}>
            <View style={styles.containerWithPadding}>
                <Header
                    title={recipe.name}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    rightComponent={
                        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                            <Icon name="trash-2" size={24} color={colors.destructive}/>
                        </TouchableOpacity>
                    }
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {recipe.image && (
                        <Image
                            source={{uri: recipe.image}}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                    )}

                    <View style={{flexDirection: 'row', gap: 24, marginVertical: 16}}>
                        {recipe.prepTime && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="clock" size={16} color={colors.mutedForeground}/>
                                <Text style={styles.mutedText}>Prep: {recipe.prepTime} min</Text>
                            </View>
                        )}
                        {recipe.cookTime && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name="clock" size={16} color={colors.mutedForeground}/>
                                <Text style={styles.mutedText}>Cook: {recipe.cookTime} min</Text>
                            </View>
                        )}
                    </View>

                    <ServingsControl
                        servings={servings}
                        onAdjustServings={adjustServings}
                    />

                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <IngredientList
                            ingredients={ingredients}
                            checkable
                            baseServings={recipe.baseServings}
                            currentServings={servings}
                            onToggleCheck={toggleIngredientChecked}
                        />
                    </View>

                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        <StepList
                            steps={steps}
                            ingredients={ingredients}
                            checkable
                            baseServings={recipe.baseServings}
                            currentServings={servings}
                            onToggleCheck={toggleStepChecked}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}