import { TCategory } from "../model/TCategory";
import { API_URL } from "./config";

export async function getHomeCategories(): Promise<TCategory[]> {
  const resp = await fetch(`${API_URL}/api/projects/frontPage`);
  return resp.json();
}
