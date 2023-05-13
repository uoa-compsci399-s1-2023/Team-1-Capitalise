import { S3_API_URL } from "./config";

export async function uploadProfilePicture(userID: string, data: FormData) {
  const resp = fetch(`${S3_API_URL}/userProfilePic/${userID}`, {
    method: "POST",
    body: data,
  });
  return resp;
}
