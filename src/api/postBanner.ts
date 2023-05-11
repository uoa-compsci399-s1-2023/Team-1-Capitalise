export async function postBanner(projectId: string, banner: any) {
  const response = await fetch(
    `https://l27nrectig.execute-api.a
  p-southeast-2.amazonaws.co
  m/dev/api/s3/banner/${projectId}`,
    {
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
      body: banner,
    }
  );
  return response;
}
