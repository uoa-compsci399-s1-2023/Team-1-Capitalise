import { S3_API_URL } from "./config";

export async function getHeroBanners() {
  const response = await fetch(`${S3_API_URL}/api/s3/heroBanner`);
  if (response.status == 404) {
    return null;
  }
  return response.json();
}

export async function getMobileHeroBanners() {
  const response = await fetch(`${S3_API_URL}/api/s3/mobileHeroBanner`);
  if (response.status == 404) {
    return null;
  }
  return response.json();
}
