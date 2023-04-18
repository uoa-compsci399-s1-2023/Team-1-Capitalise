import { API_URL } from "./config";
import { useAuth } from "../customHooks/useAuth";

export async function deleteCommentbyId(commentId: string) {
  const auth = useAuth();

  try {
    const response = await fetch(
      `${API_URL}/api/projects/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "x-auth-token": auth.getToken() as string,
        },
      }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}
