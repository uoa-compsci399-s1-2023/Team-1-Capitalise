import { S3_API_URL } from "./config";

export async function postThumbnail(projectId: string, thumbnail: FormData) {
  const response = await fetch(`${S3_API_URL}/thumbnail/${projectId}`, {
    method: "POST",
    body: thumbnail,
  });
  return response;
}
