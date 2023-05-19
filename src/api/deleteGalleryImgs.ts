import { TProject } from "../model/TProject";
import { S3_API_URL } from "./config";
// import { getProject } from "./getProject";

// async function deleteImg(pId: string, tabName: string, galleryId: string, filename: string) {
//   const resp = fetch(`${S3_API_URL}/gallerySingle/${pId}/${tabName}/${galleryId}/${filename}`, {
//     method: 'PATCH',
//   })
//   return resp;
// }


export async function deleteGalleryImgs(pId: string, tabName: string, galleryId: string, filenames: string[]) {
  
  let projJson: TProject | null = null;

  for (let i=0; i < filenames.length; i++ ) {
    const resp = await fetch(`${S3_API_URL}/api/s3/gallerySingle/${pId}/${tabName}/${galleryId}/${filenames[i]}`, {
      method: 'PATCH',
    })
    if (resp.ok) {
      projJson = await resp.json();
    } else {
      console.log(await resp.text());
    }
  }

  return projJson;
}
