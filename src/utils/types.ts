export interface Ingredient {
    id: string;
    name: string;
    amount: string;
    unit: string;
    checked?: boolean;
}

export interface Step {
    id: string;
    instruction: string;
    linkedIngredientIds: string[];
    checked?: boolean;
    stepImage?: string;
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
    steps: Step[];
    baseServings: string;
    prepTime: string;
    cookTime: string;
    image?: string;
    // Optional metadata to add later
    tags?: string[];
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}