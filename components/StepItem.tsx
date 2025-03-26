import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CheckBox from 'react-native-checkbox';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTheme} from '../context/ThemeContext';
import {Ingredient, Step} from '../utils/types';

type StepItemProps = {
    step: Step;
    index: number;
    ingredients: Ingredient[];
    onRemove: () => void;
    onUpdateStep: (updatedStep: Step) => void;
};

const StepItem = ({step, index, ingredients, onRemove, onUpdateStep}: StepItemProps) => {
    const {styles, colors} = useTheme();
    const [isLinking, setIsLinking] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInstruction, setEditedInstruction] = useState(step.instruction);

    const toggleIngredientLink = (ingredientId: string) => {
        const linkedIngredientIds = [...step.linkedIngredientIds];
        const index = linkedIngredientIds.indexOf(ingredientId);

        if (index === -1) {
            linkedIngredientIds.push(ingredientId);
        } else {
            linkedIngredientIds.splice(index, 1);
        }

        onUpdateStep({...step, linkedIngredientIds});
    };

    const pickStepImage = async () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.7,
        }, (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode) {
                console.error('Error picking image:', response.errorMessage);
                return;
            }

            if (response.assets && response.assets[0] && response.assets[0].base64) {
                onUpdateStep({
                    ...step,
                    stepImage: `data:image/jpeg;base64,${response.assets[0].base64}`
                });
            }
        });
    };

    const removeStepImage = () => {
        onUpdateStep({
            ...step,
            stepImage: undefined
        });
    };

    const finishEditing = () => {
        if (editedInstruction.trim()) {
            onUpdateStep({
                ...step,
                instruction: editedInstruction.trim()
            });
        }
        setIsEditing(false);
    };

    return (
        <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
                {isEditing ? (
                    <View style={{flex: 1}}>
                        <TextInput
                            style={[styles.textArea, {height: 80}]}
                            value={editedInstruction}
                            onChangeText={setEditedInstruction}
                            multiline
                            autoFocus
                        />
                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={finishEditing}
                        >
                            <Text style={styles.doneButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepNumber}>{index + 1}.</Text>
                        <Text style={styles.stepText}>{step.instruction}</Text>
                    </View>
                )}

                <View style={styles.stepActions}>
                    <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        style={{marginRight: 12}}
                    >
                        <Icon name="edit-2" size={16} color={colors.foreground}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsLinking(!isLinking)}
                        style={{marginRight: 12}}
                    >
                        <Icon
                            name="link"
                            size={16}
                            color={isLinking ? colors.accent : colors.foreground}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRemove}>
                        <Icon name="x" size={16} color={colors.foreground}/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Step image section */}
            {step.stepImage ? (
                <View style={styles.stepImageContainer}>
                    <Image
                        source={{uri: step.stepImage}}
                        style={styles.stepImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={removeStepImage}
                    >
                        <Icon name="x" size={16} color="#ffffff"/>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.stepImageContainer,
                        {justifyContent: 'center', alignItems: 'center'}
                    ]}
                    onPress={pickStepImage}
                >
                    <Icon name="image" size={24} color={colors.icon}/>
                    <Text style={{color: colors.mutedForeground, marginTop: 8}}>
                        Add Step Image
                    </Text>
                </TouchableOpacity>
            )}

            {/* Linked ingredients */}
            {step.linkedIngredientIds.length > 0 && !isLinking && (
                <View style={styles.linkedIngredients}>
                    {step.linkedIngredientIds.map(id => {
                        const ingredient = ingredients.find(i => i.id === id);
                        return ingredient ? (
                            <View key={id} style={styles.ingredientBadge}>
                                <Text style={styles.ingredientBadgeText}>
                                    {ingredient.name}
                                </Text>
                            </View>
                        ) : null;
                    })}
                </View>
            )}

            {/* Ingredient linking mode */}
            {isLinking && (
                <View style={styles.linkingContainer}>
                    <Text style={styles.linkingTitle}>Link ingredients to this step:</Text>
                    {ingredients.map(ingredient => (
                        <View key={ingredient.id} style={styles.linkingItem}>
                            <CheckBox
                                checked={step.linkedIngredientIds.includes(ingredient.id)}
                                onChange={() => toggleIngredientLink(ingredient.id)}
                                checkBoxColor={step.linkedIngredientIds.includes(ingredient.id) ? colors.accent : undefined}
                            />
                            <Text style={styles.linkingText}>{ingredient.name}</Text>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => setIsLinking(false)}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default StepItem;