export interface MealData {
  id_meal: string;
  name: string;
  image_url: string;
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
