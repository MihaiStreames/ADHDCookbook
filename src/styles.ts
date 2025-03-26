import {Platform, StatusBar, StyleSheet} from 'react-native';

// Define theme types
export type ThemeType = 'light' | 'dark';

// Theme colors
export const themeColors = {
    light: {
        background: '#FFFFFF',
        foreground: '#000000',
        card: '#FFFFFF',
        cardBorder: '#EEEEEE',
        muted: '#F5F5F5',
        mutedForeground: '#666666',
        primary: '#000000',
        primaryForeground: '#FFFFFF',
        secondary: '#F0F0F0',
        secondaryForeground: '#000000',
        accent: '#F0F0F0',
        accentForeground: '#000000',
        destructive: '#FF3B30',
        destructiveForeground: '#FFFFFF',
        border: '#EEEEEE',
        input: '#F5F5F5',
        accentBlue: '#0070f3',
        placeholderText: '#999999',
        ingredientAmount: '#666666',
        cardBackground: '#f1f1f1',
        imageBackground: '#f5f5f5',
        icon: '#cccccc',
        disabledIcon: '#cccccc',
    },
    dark: {
        background: '#1a1a1a',
        foreground: '#ffffff',
        card: '#333333',
        cardBorder: '#444444',
        muted: '#2A2A2A',
        mutedForeground: '#BBBBBB',
        primary: '#FFF5F5',
        primaryForeground: '#121212',
        secondary: '#2A2A2A',
        secondaryForeground: '#FFF5F5',
        accent: '#2A2A2A',
        accentForeground: '#FFF5F5',
        destructive: '#FF453A',
        destructiveForeground: '#FFF5F5',
        border: '#333333',
        input: '#2A2A2A',
        accentBlue: '#0070f3',
        placeholderText: '#888888',
        ingredientAmount: '#bbbbbb',
        cardBackground: '#333333',
        imageBackground: '#444444',
        icon: '#555555',
        disabledIcon: '#555555',
    }
};

// Create styles that depend on the theme
export const createStyles = (theme: ThemeType) => {
    const colors = themeColors[theme];

    return StyleSheet.create({
        // Common layout styles
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
        },
        containerWithPadding: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            paddingBottom: 24,
        },
        safeArea: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },

        // Header styles
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

        // Text styles
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        smallTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.foreground,
            marginLeft: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 12,
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 8,
        },
        bodyText: {
            fontSize: 16,
            color: colors.foreground,
        },
        mutedText: {
            fontSize: 14,
            color: colors.mutedForeground,
        },

        // Form styles
        formContainer: {
            flex: 1,
        },
        formSection: {
            marginBottom: 24,
        },
        input: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 12,
            color: colors.foreground,
            marginBottom: 8,
        },
        textArea: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 12,
            color: colors.foreground,
            marginBottom: 8,
            height: 100,
            textAlignVertical: 'top',
        },
        row: {
            flexDirection: 'row',
            gap: 8,
            marginBottom: 8,
        },
        col: {
            flex: 1,
        },
        col2: {
            flex: 2,
        },

        // Button styles
        primaryButton: {
            backgroundColor: colors.accentBlue,
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            marginTop: 16,
        },
        primaryButtonText: {
            color: '#ffffff',
            fontWeight: '500',
            fontSize: 16,
        },
        secondaryButton: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        secondaryButtonText: {
            color: colors.foreground,
            marginLeft: 8,
            fontWeight: '500',
        },
        iconButton: {
            padding: 8,
        },

        // Recipe card styles
        recipeCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            marginBottom: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        recipeImageContainer: {
            height: 150,
            backgroundColor: colors.imageBackground,
        },
        recipeImage: {
            width: '100%',
            height: '100%',
        },
        recipeInfo: {
            padding: 16,
        },
        recipeName: {
            fontSize: 18,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 8,
        },
        recipeDetails: {
            flexDirection: 'row',
            marginTop: 8,
        },
        recipeDetail: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 16,
        },
        recipeDetailText: {
            fontSize: 14,
            color: colors.mutedForeground,
            marginLeft: 4,
        },

        // Empty state
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 100,
        },
        emptyText: {
            fontSize: 16,
            color: colors.mutedForeground,
            textAlign: 'center',
            marginTop: 16,
        },

        // Ingredient styles
        ingredientItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
        },
        ingredientCheckItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        ingredientText: {
            color: colors.foreground,
            flex: 1,
            marginLeft: 12,
        },
        ingredientAmount: {
            color: colors.ingredientAmount,
        },
        ingredientTextChecked: {
            textDecorationLine: 'line-through',
            color: colors.mutedForeground,
        },

        // Step styles
        stepContainer: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
        },
        stepContainerChecked: {
            backgroundColor: colors.muted,
        },
        stepHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        stepContent: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'flex-start',
        },
        stepNumber: {
            fontWeight: '500',
            color: colors.foreground,
            marginRight: 4,
        },
        stepText: {
            color: colors.foreground,
            flex: 1,
        },
        stepTextChecked: {
            textDecorationLine: 'line-through',
            color: colors.mutedForeground,
        },
        stepActions: {
            flexDirection: 'row',
        },

        // Badge styles
        linkedIngredients: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
            gap: 8,
            marginLeft: 28,
        },
        ingredientBadge: {
            backgroundColor: colors.muted,
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        ingredientBadgeChecked: {
            opacity: 0.5,
        },
        ingredientBadgeText: {
            fontSize: 12,
            color: colors.foreground,
        },
        ingredientBadgeTextChecked: {
            textDecorationLine: 'line-through',
        },

        // Linking styles
        linkingContainer: {
            marginTop: 8,
        },
        linkingTitle: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.foreground,
            marginBottom: 8,
        },
        linkingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        linkingText: {
            color: colors.foreground,
            marginLeft: 8,
        },
        doneButton: {
            backgroundColor: colors.accentBlue,
            borderRadius: 8,
            padding: 8,
            alignItems: 'center',
            marginTop: 8,
        },
        doneButtonText: {
            color: '#ffffff',
            fontWeight: '500',
        },

        // Image handling styles
        imageContainer: {
            borderWidth: 2,
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderStyle: 'dashed',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        imagePreview: {
            width: '100%',
            height: 200,
            borderRadius: 8,
        },
        imageButton: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        },
        imageIcon: {
            marginBottom: 8,
        },
        imageButtonText: {
            color: colors.foreground,
        },
        removeButton: {
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: colors.destructive,
            borderRadius: 4,
            padding: 4,
        },

        // Servings control styles
        servingsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.card,
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
            color: colors.foreground,
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
            backgroundColor: colors.muted,
            justifyContent: 'center',
            alignItems: 'center',
        },
        servingsValue: {
            width: 32,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '500',
            color: colors.foreground,
        },

        // Floating action button
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.accentBlue,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
    });
};