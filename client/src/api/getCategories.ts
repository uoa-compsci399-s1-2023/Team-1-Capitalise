import { TCategory } from "../model/TCategory";
import { API_URL } from "./config";

export async function getCategories(): Promise<TCategory[]> {
  const resp = await fetch(`${API_URL}/api/parameters/categories`);
  return resp.json();
}
