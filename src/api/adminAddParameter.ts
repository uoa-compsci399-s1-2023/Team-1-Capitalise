import { TProject } from "../model/TProject";
import {API_URL} from "./config"

export async function createProject(parameterValue: string, parameterType: string, token: string) {
    const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
        Accept: "application/json",
                "Content-Type": "application/json",
                "x-auth-token": token,
    },
    body: JSON.stringify({
      value: parameterValue,
      parameterType: parameterType
    }),
  })
  .then((response) => {
    return response.json();
  })
}
