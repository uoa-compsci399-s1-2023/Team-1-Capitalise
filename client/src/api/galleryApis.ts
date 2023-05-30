import { S3_API_URL } from "./config";

export async function addGalleryImgs(pId: string, tabName: string, galleryId: string, formData: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/uploadGallery/${pId}/${tabName}/${galleryId}`, {
    method: 'PATCH',
    body: formData
  })
  return resp
}

// https://l27nrectig.execute-api.ap-s outheast-2.amazonaws.com/dev/ api/s3/gallerySingleS3/{projectId}/ {tabName}/{Key}
export async function removeGalleryImg(pId: string, tabName: string, galleryId: string, filename: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/gallerySingleS3/${pId}/${tabName}/${filename}`, {
    method: 'PATCH',
  })
  return resp
}

// https://l27nrectig.execute-api.ap-s outheast-2.amazonaws.com/dev/ api/s3/allGallery/{projectId}/{tabN ame}/{galleryId}
export async function deleteGallery(pId: string, tabName: string, gId: string) {
  const resp = fetch(`${S3_API_URL}/api/s3/allGallery/${pId}/${tabName}/${gId}`, {
    method: 'DELETE',
  })
  return resp
}