import { API_URL } from "./config";
// NOT IN USE SINCE WE GET INVALID HOOK ERROR WHEN WORKING WITH AUTH
// API CALL IS BEING DONE WITHIN THE COMPONENTS THEMSELVES
// KEEPING THIS HERE JUST IN CASE.

import { useAuth } from "../customHooks/useAuth";

export async function likeProject(projectId: string) {
  fetch(`${API_URL}/api/projects/${projectId}/like`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMyZjg1ZjZjY2UyZmMxNzA2NTcyY2YiLCJ1c2VybmFtZSI6InJ3dTA1MCIsInVzZXJUeXBlIjoiZ3JhZHVhdGUiLCJpYXQiOjE2ODE3OTA3NDMsImV4cCI6MTY4NDM4Mjc0M30.epPesgMBsXRaf3mwVVrVyDq8Ovvh4fXW0uPTveEJ7Mw",
    },
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}
