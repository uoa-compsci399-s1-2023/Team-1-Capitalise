import { TSemester } from "../model/TSemester";
import { API_URL } from "./config";

export async function getSemesters(): Promise<TSemester[]> {
  const resp = await fetch(`${API_URL}/api/parameters/semesters`);
  return resp.json();
}
