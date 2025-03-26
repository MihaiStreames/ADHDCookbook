import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../context/ThemeContext';
import {Recipe} from '../utils/types';

type RecipeCardProps = {
    recipe: Recipe;
    onPress: () => void;
};

const RecipeCard = ({recipe, onPress}: RecipeCardProps) => {
    const {styles, colors} = useTheme();

    return (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={onPress}
        >
            <View style={styles.recipeImageContainer}>
                {recipe.image ? (
                    <Image
                        source={{uri: recipe.image}}
                        style={styles.recipeImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.recipeImage, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Icon name="image" size={40} color={colors.icon}/>
                    </View>
                )}
            </View>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <View style={styles.recipeDetails}>
                    {recipe.prepTime && (
                        <View style={styles.recipeDetail}>
                            <Icon name="clock" size={14} color={colors.mutedForeground}/>
                            <Text style={styles.recipeDetailText}>Prep: {recipe.prepTime} min</Text>
                        </View>
                    )}
                    {recipe.cookTime && (
                        <View style={styles.recipeDetail}>
                            <Icon name="clock" size={14} color={colors.mutedForeground}/>
                            <Text style={styles.recipeDetailText}>Cook: {recipe.cookTime} min</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RecipeCard;