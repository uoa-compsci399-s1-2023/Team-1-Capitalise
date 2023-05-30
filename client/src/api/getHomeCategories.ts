import { TFrontCategory } from "../model/TFrontCategory";
import { API_URL } from "./config";

export async function getHomeCategories(): Promise<TFrontCategory[]> {
  const resp = await fetch(`${API_URL}/api/projects/frontPage`);
  return resp.json();
}
