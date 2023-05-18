import { S3_API_URL } from "./config";

// https://l27nrectig.execute-api.a p-southeast-2.amazonaws.co m/dev/api/s3/banner/{projectId}

export async function uploadBanner(pId: string, data: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/banner/${pId}`, {
    method: "POST",
    body: data,
  });
  return resp;
}
