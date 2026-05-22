export interface MealData {
  id_meal: string;
  name: string;
  image_url: string;
  save_count?: number;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface MealDetailData extends MealData {
  instructions?: string;
  id_category?: string;
  category?: string;
  area?: string;
  categories?: { category: string } | null;
  areas?: { area: string } | null;
  ingredients?: Ingredient[];
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  recipeCount: number;
  coverImage?: string;
}

export interface UserMeal {
  id_meal: string;
  name: string;
  image_url?: string;
  category?: string;
  area?: string;
  is_public: boolean;
  ingredientCount: number;
}
