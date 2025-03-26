import React, {useState} from 'react';
import {Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import type {Ingredient, Recipe, Step} from '../utils/types';
import {generateUUID} from '../utils/uuid';
import StepItem from '../components/StepItem';

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

    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Recipe name required', 'Please enter a name for your recipe.');
            return;
        }

        // Create new recipe
        const newRecipe: Recipe = {
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

        try {
            // Get existing recipes from AsyncStorage
            const savedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];

            // Add new recipe and save back to AsyncStorage
            await AsyncStorage.setItem('recipes', JSON.stringify([...recipes, newRecipe]));

            // Navigate back to home
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save recipe:', error);
            Alert.alert('Error', 'Failed to save recipe. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.containerWithPadding}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                            <Feather name="arrow-left" size={24} color={colors.foreground}/>
                        </TouchableOpacity>
                        <Text style={styles.smallTitle}>Add Recipe</Text>
                    </View>
                </View>

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
                            <View style={{marginTop: 8}}>
                                {ingredients.map((ingredient, index) => (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Text style={styles.ingredientText}>
                                            {ingredient.name}
                                            {(ingredient.amount || ingredient.unit) && (
                                                <Text style={styles.ingredientAmount}>
                                                    {' '}({ingredient.amount} {ingredient.unit})
                                                </Text>
                                            )}
                                        </Text>
                                        <TouchableOpacity onPress={() => removeIngredient(index)}
                                                          style={styles.iconButton}>
                                            <Feather name="x" size={20} color={colors.foreground}/>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
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
                            <View style={{marginTop: 12}}>
                                {steps.map((step, index) => (
                                    <StepItem
                                        key={step.id}
                                        step={step}
                                        index={index}
                                        ingredients={ingredients}
                                        onRemove={() => removeStep(index)}
                                        onUpdateStep={updateStep}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Recipe Image</Text>
                        <View style={styles.imageContainer}>
                            {image ? (
                                <View style={{width: '100%'}}>
                                    <Image source={{uri: image}} style={styles.imagePreview} resizeMode="cover"/>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => setImage(undefined)}
                                    >
                                        <Feather name="x" size={16} color="#ffffff"/>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                    <Feather
                                        name="image"
                                        size={40}
                                        color={colors.placeholderText}
                                        style={styles.imageIcon}
                                    />
                                    <Text style={styles.imageButtonText}>Add Recipe Photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                        <Text style={styles.primaryButtonText}>Save Recipe</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}