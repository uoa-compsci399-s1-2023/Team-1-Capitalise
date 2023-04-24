// NOT IN USE SINCE WE GET INVALID HOOK ERROR WHEN WORKING WITH AUTH
// API CALL IS BEING DONE WITHIN THE COMPONENTS THEMSELVES
// KEEPING THIS HERE JUST IN CASE.

import { API_URL } from "./config";
import { useAuth } from "../customHooks/useAuth";

export async function deleteCommentbyId(commentId: string) {
  fetch(`${API_URL}/api/projects/comment/${commentId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMyZjg1ZjZjY2UyZmMxNzA2NTcyY2YiLCJ1c2VybmFtZSI6InJ3dTA1MCIsInVzZXJUeXBlIjoiZ3JhZHVhdGUiLCJpYXQiOjE2ODE3OTA3NDMsImV4cCI6MTY4NDM4Mjc0M30.epPesgMBsXRaf3mwVVrVyDq8Ovvh4fXW0uPTveEJ7Mw",
    },
    body: JSON.stringify({
      commentId: commentId,
    }),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}
