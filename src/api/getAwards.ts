import { TAward } from "../model/TAward";
import { API_URL } from "./config";

export async function getAwards(): Promise<TAward[]> {
  const resp = await fetch(`${API_URL}/api/parameters/awards`);
  return resp.json();
}
