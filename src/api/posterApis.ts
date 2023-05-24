// https://l27nrectig.execute-api.ap-southeast-2.amazonaws.com/dev/api/s3/poster/6432f9226cce2fc1706572e3/test45dd/6469afb2d1faba7eb5a37d42
import { S3_API_URL } from "./config";

export async function uploadPdf(pId: string, tabName: string, blockId: string, data: FormData) {
  const resp = fetch(`${S3_API_URL}/api/s3/poster/${pId}/${tabName}/${blockId}`, {
    method: "POST",
    body: data,
  });
  return resp;
}