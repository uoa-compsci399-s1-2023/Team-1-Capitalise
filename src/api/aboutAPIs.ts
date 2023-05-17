import { TAbout } from "../model/TAbout";
import { API_URL } from "./config";

export async function getAbout(): Promise<TAbout[]> {
  const resp = await fetch(`${API_URL}/api/about`);
  return resp.json();
}

export async function addAbout(title: string, body: string, token: string) {
  const resp = await fetch(`${API_URL}/api/about`, {
    method: "POST",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      body: body,
    }),
  });
  return resp.json();
}

export async function editAbout(
  id: string,
  title: string,
  body: string,
  token: string
) {
  const resp = await fetch(`${API_URL}/api/about/${id}`, {
    method: "PATCH",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      body: body,
    }),
  });
  return resp.json();
}

export async function deleteAbout(id: string, token: string) {
  const resp = await fetch(`${API_URL}/api/about/${id}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
  });
  return resp.json();
}
