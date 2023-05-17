import { API_URL } from "./config";
import { S3_API_URL } from "./config";

export async function deleteAwardImage(awardName: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/award/${awardName}`, {
    method: "DELETE",
  });
  return resp;
}
