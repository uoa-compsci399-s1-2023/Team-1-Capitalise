import { API_URL } from "./config";
import { useAuth } from "../customHooks/useAuth";

export async function createComment(projectId: string, commentBody: string) {
  const auth = useAuth();

  try {
    const response = await fetch(`${API_URL}/api/projects/comment`, {
      method: "POST",
      headers: {
        "x-auth-token": auth.getToken() as string,
      },
      body: JSON.stringify({
        projectId: projectId,
        commentBody: commentBody,
      }),
    });

    if (response.ok) {
      return;
    } else {
      throw new Error("Failed to create comment");
    }
  } catch (error) {
    console.error("Error creating comment:", error);
  }
}
