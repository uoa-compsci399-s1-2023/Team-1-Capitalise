import { TAward } from "../model/TAward";
import { API_URL } from "./config";

export async function getAwardTypes(): Promise<TAward[]> {
  const response = await fetch(`${API_URL}/api/parameters/awards`);
  return response.json();
}
