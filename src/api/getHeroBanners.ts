import { S3_API_URL } from "./config";

S3_API_URL;
export async function getHeroBanners() {
  const response = await fetch(`${S3_API_URL}/heroBanner`);
  if (response.status == 404) {
    return null;
  }
  return response.json();
}
