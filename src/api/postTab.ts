import { S3_API_URL } from "./config";

export async function postTab(
  projectId: string,
  tabName: string,
  tabData: FormData
) {
  const response = await fetch(
    `${S3_API_URL}/project/${projectId}/${tabName}`,
    {
      method: "POST",
      body: tabData,
    }
  );
  return response;
}
