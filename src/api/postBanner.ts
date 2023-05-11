import { S3_API_URL } from "./config";

export async function postBanner(projectId: string, banner: FormData) {
  const response = await fetch(`${S3_API_URL}/banner/${projectId}`, {
    method: "POST",
    body: banner,
  });
  return response;
}
