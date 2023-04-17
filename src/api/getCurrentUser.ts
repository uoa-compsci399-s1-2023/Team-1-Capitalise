import { API_URL } from "./config";
import { useAuth } from "../customHooks/useAuth";

export async function getCurrentUser() {
  const auth = useAuth();

  const response = await fetch(`${API_URL}/api/users/getCurrentUser/me`, {
    headers: {
      "x-auth-token": auth.getToken() as string,
    },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  return response.json();
}
