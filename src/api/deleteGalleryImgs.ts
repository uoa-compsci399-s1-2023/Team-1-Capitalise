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
    const resp = await fetch(`${S3_API_URL}/gallerySingle/${pId}/${tabName}/${galleryId}/${filenames[i]}`, {
      method: 'PATCH',
    })
    if (resp.ok) {
      projJson = await resp.json();
    } else {
      console.log(await resp.text());
    }
  }

  return projJson;
  
  
  // const promises: Promise<Response>[] = []
  // filenames.forEach(filename => {
  //   promises.push(deleteImg(pId, tabName, galleryId, filename));
  // });
  // await Promise.all(promises);
  // const project = await getProject(pId);
  // return project
}
