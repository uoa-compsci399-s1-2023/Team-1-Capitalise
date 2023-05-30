import { API_URL } from "./config";
import { TComment } from "../model/TComment";

export async function getProjectComments(
  projectId: string
): Promise<TComment[]> {
  const response = await fetch(`${API_URL}/api/projects/comments/${projectId}`);
  return response.json();
}