import { API_URL } from "./config";

// https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/users/search?name=lucas&isAvaliable=true&startIndex=0&numUsers=2

export async function searchUsers(
  keyword: string,
  isAvaliable: boolean,
  startIndex: number,
  numUsers: number,
): Promise<Response> {
  
  const response = await fetch(
    `${API_URL}/api/users/search?name=${keyword}&isAvaliable=${isAvaliable}&startIndex=${startIndex}&numUsers=${numUsers}`
  );
  
  return response
}
