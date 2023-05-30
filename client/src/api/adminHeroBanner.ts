import { S3_API_URL } from "./config";

export async function uploadHeroBanner(data: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/heroBanner`, {
    method: "POST",
    body: data,
  });
  return resp;
}

export async function deleteHeroBanner(filename: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/heroBanner/${filename}`, {
    method: "DELETE",
  });
  return resp;
}

export async function uploadMobileHeroBanner(data: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/mobileHeroBanner`, {
    method: "POST",
    body: data,
  });
  return resp;
}

export async function deleteMobileHeroBanner(filename: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/mobileHeroBanner/${filename}`, {
    method: "DELETE",
  });
  return resp;
}
