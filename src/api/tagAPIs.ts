// https://mbw0ut8bmf.execute-api.ap-southeast-2.amazonaws.com/staging/api/tags/search?name={name}&startIndex={index}

import { API_URL, S3_API_URL } from "./config";

export async function searchTags(
  keyword: string,
	startIndex: number
): Promise<Response> {
  
  const response = await fetch(
    `${API_URL}/api/tags/search?name=${encodeURIComponent(keyword)}&startIndex=${encodeURIComponent(startIndex)}`
  );
  
  return response
}

// https://mbw0ut8bmf.execut e-api.ap-southeast-2.amaz onaws.com/staging/api/tag s/{tagName}/{projectId}
export async function createNewTag(pId: string, tagName: string, token: string) {
	const response = await fetch(`${S3_API_URL}/api/tags/${tagName}/${pId}`, {
		method: 'POST',
		headers: {
			'x-auth-token': token
		}
	})
	return response;
}

// https://mbw0ut8bmf.execute-api.ap- southeast-2.amazonaws.com/stagin g/api/tags/{tagName}/{projectId}
export async function addTagToProject(pId: string, tagName: string, token: string) {
	const response = await fetch(`${S3_API_URL}/api/tags/${tagName}/${pId}`, {
		method: 'PATCH',
		headers: {
			'x-auth-token': token
		}
	})
	return response;
}

// https://mbw0ut8bmf.execute-api.ap-southea st-2.amazonaws.com/staging/api/tags/{tagN ame}/{projectId}
export async function removeTagFromProject(pId: string, tagName: string, token: string) {
	const response = await fetch(`${S3_API_URL}/api/tags/${tagName}/${pId}`, {
		method: 'DELETE',
		headers: {
			'x-auth-token': token
		}
	})
	return response;
}