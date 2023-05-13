import { S3_API_URL } from "./config";

export async function addGallery(
  projectId: string,
  tabName: string,
  galleryData: FormData
) {
  const response = await fetch(
    `${S3_API_URL}/gallery/${projectId}/${tabName}`,
    {
      method: "POST",
      body: galleryData,
    }
  );
  return response;
}
