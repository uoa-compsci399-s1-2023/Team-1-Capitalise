import { S3_API_URL } from "./config";

// https://l27nrectig.execute-api.ap -southeast-2.amazonaws.com/d ev/api/s3/thumbnail/{projectId}

export async function uploadThumbnail(pId: string, data: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/thumbnail/${pId}`, {
    method: "POST",
    body: data,
  });
  return resp;
}

export async function removeThumbnail(pId: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/thumbnail/${pId}`, {
    method: "DELETE",
  });
  return resp;
}


export async function getDefaultThumbnail() {
  const resp = fetch(`${S3_API_URL}/api/s3/defaultBanners`, {
    method: "GET",
  });
  return resp;
}