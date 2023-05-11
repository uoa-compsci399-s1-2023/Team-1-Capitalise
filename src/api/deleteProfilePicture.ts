import { S3_API_URL } from "./config";

export async function deleteProfilePicture(userID: string) {
  const resp = fetch(`${S3_API_URL}/userProfilePic/${userID}`, {
    method: "DELETE",
  });
  return resp;
}
