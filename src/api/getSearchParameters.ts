import { API_URL } from "./config";

export default async function getSearchParams() {

  const responses = await Promise.all([
    fetch(`${API_URL}/api/parameters/categories`),
    fetch(`${API_URL}/api/parameters/semesters`),
    fetch(`${API_URL}/api/parameters/awards`),
    fetch(`${API_URL}/api/parameters/sortBys`),
  ]);

  return await Promise.all(responses.map((r) => {
    if (r.ok) {
      return r.json()
    } else {
      console.log(`failed to fetch parameter ${r.text()}`)
    }
    }));
}
