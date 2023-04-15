import { API_URL } from "./config";

export type TComment = {
  projectId: string;
  commentBody: string;
  userId: string;
  // put date later.
};

// first we define the data we want to send in the request body
// at this point, we are hard-coding the data we want to pass.
const requestData = {
  projectId: "6432f9226cce2fc1706572e3", // hardcode for now
  commentBody: "Rachel's test comment",
};

// define the headers for the request
// we set the content-type header to application/json to indicate request body contains JSON data.
const headers = new Headers();
headers.append("Content-Type", "application/json");

// define request options
const requestOptions: RequestInit = {
  method: "POST",
  headers: headers,
  body: JSON.stringify(requestData),
};

// function to make the post request
export async function writeComment() {
  fetch(`${API_URL}/api/comment`, requestOptions)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData: any) => {
      console.log("Response:", responseData);
      // handle the response data
    })
    .catch((error: any) => {
      console.log("Error:", error);
      // handle the error
    });
}
