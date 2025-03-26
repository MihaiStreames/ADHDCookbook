import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import {useTheme} from '../context/ThemeContext';
import {Ingredient} from '../utils/types';

type IngredientListProps = {
    ingredients: Ingredient[];
    editable?: boolean;
    checkable?: boolean;
    baseServings?: string;
    currentServings?: number;
    onRemove?: (index: number) => void;
    onToggleCheck?: (id: string) => void;
};

const IngredientList = ({
                            ingredients,
                            editable = false,
                            checkable = false,
                            baseServings = '1',
                            currentServings = 1,
                            onRemove,
                            onToggleCheck
                        }: IngredientListProps) => {
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
            <View>
                {ingredients.map((ingredient, index) => (
                    <View key={ingredient.id} style={styles.ingredientItem}>
                        <Text style={styles.ingredientText}>
                            {ingredient.name}
                            {(ingredient.amount || ingredient.unit) && (
                                <Text style={styles.ingredientAmount}>
                                    {' '}({ingredient.amount} {ingredient.unit})
                                </Text>
                            )}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onRemove?.(index)}
                            style={styles.iconButton}
                        >
                            <Feather name="x" size={20} color={colors.foreground}/>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    }

    if (checkable) {
        return (
            <View>
                {ingredients.map((ingredient) => (
                    <View key={ingredient.id} style={styles.ingredientCheckItem}>
                        <CheckBox
                            value={ingredient.checked}
                            onValueChange={() => onToggleCheck?.(ingredient.id)}
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
                                    {' '}({calculateAmount(ingredient.amount)} {ingredient.unit})
                                </Text>
                            )}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    return (
        <View>
            {ingredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientCheckItem}>
                    <Text style={styles.ingredientText}>
                        <Text style={{fontWeight: '500'}}>{ingredient.name}</Text>
                        {(ingredient.amount || ingredient.unit) && (
                            <Text style={styles.ingredientAmount}>
                                {' '}({calculateAmount(ingredient.amount)} {ingredient.unit})
                            </Text>
                        )}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default IngredientList;