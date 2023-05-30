import { S3_API_URL } from "./config";

//https://l27nrectig.execute-api.ap-s outheast-2.amazonaws.com/dev/ api/s3/uploadGallery/{projectId}/{t abName}/{galleryId}

export async function addGalleryImgs(pId: string, tabName: string, galleryId: string, formData: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/uploadGallery/${pId}/${tabName}/${galleryId}`, {
    method: 'PATCH',
    body: formData
  })
  return resp
}
