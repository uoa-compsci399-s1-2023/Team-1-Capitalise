import { S3_API_URL } from "./config";

export async function addGalleryImgs(pId: string, tabName: string, galleryId: string, formData: FormData) {
  const resp = fetch(`${S3_API_URL}/uploadGallery/${pId}/${tabName}/${galleryId}`, {
    method: 'PATCH',
    body: formData
  })
  return resp
}
