import { API_URL } from "./config";

export async function addParameter(
  value: string,
  parameterType: string,
  token: string
) {
  const resp = await fetch(`${API_URL}/api/parameters`, {
    method: "POST",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      value: value,
      parameterType: parameterType,
    }),
  });
  return resp.json();
}
