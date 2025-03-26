import React, {useState} from 'react';
import {Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import {useNavigationTheme} from '../context/NavigationThemeContext';
import {Ingredient, Step} from '../utils/types';
import {generateUUID} from '../utils/uuid';
import {createNewRecipe, saveRecipe} from '../utils/recipeUtils';

// Components
import Header from '../components/Header';
import ImagePicker from '../components/ImagePicker';
import IngredientList from '../components/IngredientList';
import StepList from '../components/StepList';

export default function AddRecipeScreen({navigation}) {
    const {styles, colors} = useTheme();
    const [name, setName] = useState('');
    const [currentIngredientName, setCurrentIngredientName] = useState('');
    const [currentIngredientAmount, setCurrentIngredientAmount] = useState('');
    const [currentIngredientUnit, setCurrentIngredientUnit] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [currentStep, setCurrentStep] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [baseServings, setBaseServings] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);

    const addIngredient = () => {
        if (currentIngredientName.trim()) {
            const newIngredient: Ingredient = {
                id: generateUUID(),
                name: currentIngredientName.trim(),
                amount: currentIngredientAmount.trim(),
                unit: currentIngredientUnit.trim(),
            };
            setIngredients([...ingredients, newIngredient]);
            setCurrentIngredientName('');
            setCurrentIngredientAmount('');
            setCurrentIngredientUnit('');
        }
    };

    const removeIngredient = (index: number) => {
        // Also remove this ingredient from any steps that link to it
        const ingredientId = ingredients[index].id;
        setSteps(
            steps.map((step) => ({
                ...step,
                linkedIngredientIds: step.linkedIngredientIds.filter((id) => id !== ingredientId),
            }))
        );

        // Remove the ingredient
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const addStep = () => {
        if (currentStep.trim()) {
            const newStep: Step = {
                id: generateUUID(),
                instruction: currentStep.trim(),
                linkedIngredientIds: [],
            };
            setSteps([...steps, newStep]);
            setCurrentStep('');
        }
    };

    const updateStep = (updatedStep: Step) => {
        setSteps(steps.map(step =>
            step.id === updatedStep.id ? updatedStep : step
        ));
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Recipe name required', 'Please enter a name for your recipe.');
            return;
        }

        try {
            // Create new recipe using utility function
            const newRecipe = createNewRecipe(
                name,
                ingredients,
                steps,
                baseServings,
                prepTime,
                cookTime,
                image
            );

            // Save recipe using utility function
            await saveRecipe(newRecipe);

            // Navigate back to home
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save recipe:', error);
            Alert.alert('Error', 'Failed to save recipe. Please try again.');
        }
    };

    const {containerStyle} = useNavigationTheme();

    return (
        <SafeAreaView style={[styles.safeArea, containerStyle]}>
            <View style={styles.containerWithPadding}>
                <Header
                    title="Add Recipe"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />

                <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Recipe Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter recipe name"
                            placeholderTextColor={colors.placeholderText}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Base Servings</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="4"
                                    placeholderTextColor={colors.placeholderText}
                                    value={baseServings}
                                    onChangeText={setBaseServings}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Prep (min)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    placeholderTextColor={colors.placeholderText}
                                    value={prepTime}
                                    onChangeText={setPrepTime}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Cook (min)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="30"
                                    placeholderTextColor={colors.placeholderText}
                                    value={cookTime}
                                    onChangeText={setCookTime}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Ingredients</Text>
                        <View style={styles.row}>
                            <View style={styles.col3}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingredient name"
                                    placeholderTextColor={colors.placeholderText}
                                    value={currentIngredientName}
                                    onChangeText={setCurrentIngredientName}
                                />
                            </View>
                            <View style={styles.col}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Amount"
                                    placeholderTextColor={colors.placeholderText}
                                    value={currentIngredientAmount}
                                    onChangeText={setCurrentIngredientAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.col}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Unit"
                                    placeholderTextColor={colors.placeholderText}
                                    value={currentIngredientUnit}
                                    onChangeText={setCurrentIngredientUnit}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.secondaryButton} onPress={addIngredient}>
                            <Feather name="plus" size={16} color={colors.secondaryForeground}/>
                            <Text style={styles.secondaryButtonText}>Add Ingredient</Text>
                        </TouchableOpacity>

                        {ingredients.length > 0 && (
                            <IngredientList
                                ingredients={ingredients}
                                editable
                                onRemove={removeIngredient}
                            />
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Steps</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter a step instruction"
                            placeholderTextColor={colors.placeholderText}
                            value={currentStep}
                            onChangeText={setCurrentStep}
                            multiline
                        />
                        <TouchableOpacity style={styles.secondaryButton} onPress={addStep}>
                            <Feather name="plus" size={16} color={colors.secondaryForeground}/>
                            <Text style={styles.secondaryButtonText}>Add Step</Text>
                        </TouchableOpacity>

                        {steps.length > 0 && (
                            <StepList
                                steps={steps}
                                ingredients={ingredients}
                                editable
                                onRemove={removeStep}
                                onUpdateStep={updateStep}
                            />
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Recipe Image</Text>
                        <ImagePicker
                            image={image}
                            onImageSelected={setImage}
                            onImageRemoved={() => setImage(undefined)}
                            placeholder="Add Recipe Photo"
                        />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                        <Text style={styles.primaryButtonText}>Save Recipe</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}