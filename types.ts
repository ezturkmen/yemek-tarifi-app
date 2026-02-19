export type IngredientCategory = 'Sebze & Meyve' | 'Et & Şarküteri' | 'Süt & Kahvaltılık' | 'Bakliyat & Tahıl' | 'Kuruyemiş & Diğer';

export interface Ingredient {
  name: string;
  category: IngredientCategory;
}

// We primarily use string arrays for selection now, but keeping Recipe structure
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  missingIngredients: string[];
  instructions: string[];
  prepTime: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  calories?: string;
  sourceName?: string;
  recipeCategory?: string;
}

export interface GenerationResponse {
  recipes: Recipe[];
}