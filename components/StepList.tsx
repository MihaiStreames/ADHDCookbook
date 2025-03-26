import React from 'react';
import {Image, Text, View} from 'react-native';
import Checkbox from 'expo-checkbox';
import {useTheme} from '../context/ThemeContext';
import {Ingredient, Step} from '../utils/types';
import StepItem from './StepItem';

type StepListProps = {
    steps: Step[];
    ingredients: Ingredient[];
    editable?: boolean;
    checkable?: boolean;
    baseServings?: string;
    currentServings?: number;
    onRemove?: (index: number) => void;
    onUpdateStep?: (step: Step) => void;
    onToggleCheck?: (id: string) => void;
};

const StepList = ({
                      steps,
                      ingredients,
                      editable = false,
                      checkable = false,
                      baseServings = '1',
                      currentServings = 1,
                      onRemove,
                      onUpdateStep,
                      onToggleCheck
                  }: StepListProps) => {
    const {styles, colors} = useTheme();

    // Calculate adjusted amount based on servings
    const calculateAmount = (amount: string) => {
        const baseAmount = Number.parseFloat(amount);
        const base = Number.parseInt(baseServings) || 1;
        if (isNaN(baseAmount)) return amount;
        const adjusted = (baseAmount / base) * currentServings;
        return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
    };

    if (editable) {
        return (
            <View style={{marginTop: 12}}>
                {steps.map((step, index) => (
                    <StepItem
                        key={step.id}
                        step={step}
                        index={index}
                        ingredients={ingredients}
                        onRemove={() => onRemove?.(index)}
                        onUpdateStep={(updatedStep) => onUpdateStep?.(updatedStep)}
                    />
                ))}
            </View>
        );
    }

    if (checkable) {
        return (
            <View>
                {steps.map((step, index) => (
                    <View
                        key={step.id}
                        style={[
                            styles.stepContainer,
                            step.checked && styles.stepContainerChecked,
                        ]}
                    >
                        <View style={styles.stepContent}>
                            <Checkbox
                                value={step.checked}
                                onValueChange={() => onToggleCheck?.(step.id)}
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
                                                        {' '}({calculateAmount(ingredient.amount)} {ingredient.unit})
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
        );
    }

    return (
        <View>
            {steps.map((step, index) => (
                <View key={step.id} style={styles.stepContainer}>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepText}>
                            <Text style={{fontWeight: '500'}}>{index + 1}. </Text>
                            {step.instruction}
                        </Text>
                    </View>

                    {step.stepImage && (
                        <View style={styles.stepImageContainer}>
                            <Image
                                source={{uri: step.stepImage}}
                                style={styles.stepImage}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default StepList;