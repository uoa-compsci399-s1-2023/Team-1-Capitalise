import { S3_API_URL } from "./config";

export async function addGallery(
  projectId: string,
  tabName: string,
  galleryData: FormData
) {
  const response = await fetch(
    `${S3_API_URL}/api/s3/gallery/${projectId}/${tabName}`,
    {
      method: "POST",
      body: galleryData,
    }
  );
  return response;
}
