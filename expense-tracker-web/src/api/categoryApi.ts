import type { CategoryResponse } from "../types/category";
import apiClient from "./apiClient";

export async function getCategories(): Promise<CategoryResponse[]> {
  const response = await apiClient.get<CategoryResponse[]>("/categories");

  return response.data;
}
