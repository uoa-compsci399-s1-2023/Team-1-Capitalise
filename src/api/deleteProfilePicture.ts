import { S3_API_URL } from "./config";

export async function deleteProfilePicture(userID: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/userProfilePic/${userID}`, {
    method: "DELETE",
  });
  return resp;
}
