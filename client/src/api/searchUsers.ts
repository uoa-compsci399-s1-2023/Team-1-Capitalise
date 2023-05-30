import { API_URL } from "./config";

// https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/users/search?name=:name&isAvailable=true&userRole=:userRole


export async function searchUsers(
  keyword: string,
  isAvailable: boolean,
  startIndex: number,
  numUsers: number,
  userRole: 'visitor' | 'graduate' | 'admin'
): Promise<Response> {
  
  const response = await fetch(
    // `${API_URL}/api/users/search?name=${keyword}&isAvailable=${isAvailable}&startIndex=${startIndex}&numUsers=${numUsers}&userRole=${userRole}`
    `${API_URL}/api/users/search?` + new URLSearchParams({
      name: keyword.trim(),
      isAvailable: '' + isAvailable,
      startIndex: '' + startIndex,
      numUsers: '' + numUsers,
      userRole: userRole
    })
  );
  
  return response
}
