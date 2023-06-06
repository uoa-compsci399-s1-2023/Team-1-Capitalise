# [Capitalise](https://www.capitalise.space/)

![](/markdown/TeamName.svg)
![](/markdown/Team.svg)

We are formed of 6 Computer Science graduates who have taken papers such as CS235, CS335, CS351, and CS345. We have demonstrated the skills gained from these courses to bring to you Capitalise.space.

**Frontend Team:**

- Yathi Kimbadi - Frontend Developer
- Albert Lin - Frontend Developer
- Rachel Wu - Frontend and UI/UX Designer
- Daniel Quach - Frontend and UI/UX Designer

**Backend Team:**

- Lucas Eng - Backend and Cloud Engineer
- Andrew Loh - Backend and Cloud Engineer

![](/markdown/ProjectInformation.svg)

Capitalise is a one-stop shop where students can upload their capstone projects for the world to see, and employers can view them conveniently without reading through hundreds of lines of code. 

Our team used [Jira Software](https://www.atlassian.com/software/jira) as our project management tool. Additionaly we kept track of our client and group meetings through a shared google drive
![](/markdown/roadmap.png)


![](/markdown/Technologies.svg)

**Hosting Technologies:**

- [AWS EC2](https://aws.amazon.com/ec2/) (Default backend)
- [AWS Lambda](https://aws.amazon.com/lambda/) (Serverless backend / relegated backend)
- [AWS Amplify](https://aws.amazon.com/amplify/) (Frontend)

**Frontend Technologies:**

- [React](https://react.dev/) v18.2.0
- [Vite](https://vitejs.dev/) v4.2.1
- [Mui](https://mui.com/) v5.11.16
- [TypeScript](https://www.typescriptlang.org/) v4.9.5

**Backend Technologies:**

- JavaScript
  - [Nodejs](https://nodejs.org/en) v20.0.0
  - [Express.js](https://expressjs.com/) v4.18.2
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB](https://www.mongodb.com/)
- [AWS API Gateway](https://aws.amazon.com/api-gateway/)
- [AWS S3](https://aws.amazon.com/s3/)

This a list of the main technologies used, for a full list of dependencies check the package.json in the server and client folder.

![](/markdown/Installation.svg)

**Backend Installation**
Simply clone our repository in a terminal, make sure you have node.js and git installed on your computer
```
git clone https://github.com/uoa-compsci399-s1-2023/project-team-1
cd backend
npm install
```
Now that all the require modules are installed create a .env file in the /backend directory and add these variables

|      Name     |  Description  |
| ------------- | ------------- |
| MONGO_URL | URL of a mongoDb  |
| JWT_PRIVATE_KEY  | JWT key to encrypt data  |
| ACCESSKEY  | AWS IAM Access key |
| SECRETKEY  | AWS IAM Secret key |
| BUCKET  | S3 bucket name  |
| REGION  | S3 region |
| GOOGLE_CLIENT_ID  | Google Oauth ID|
| GOOGLE_CLIENT_SECRET  | Google Oauth Secret|
| DEFAULTPROFILEPICTURE  | default url of a user profile picture |
| DEFAULTTHUMBNAIL  | default thumbnail of a project|
| NODEMAILEREMAIL  | confimation email of our project|
| NODEMAILERPASS  | email password |
| REDIRECT_API  | API gateway redirect |

If working locally simply add `PORT=3000` to the .env file

Now run `npm run dev` || `nodemon index.js`
The server should be accessible via Postman

**Frontend Installation**



Simply clone the repository and navigate to the client folder

```
git clone https://github.com/uoa-compsci399-s1-2023/project-team-1
cd client
npm install
```
Since we our endpoints only accepts request from the domain https://www.capitalise.space/.
An API Gateway api would need to be created.

Simply navigate to [AWS API Gateway](https://ap-southeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-southeast-2) (Changing the region if you wish)
Then create a proxy endpoint that handles any HTTP request method

Deploy the api and then go to the options => Integration Response

Open the dropdown arrow add x-auth-token to Access-Control-Allow-Headers

![](/markdown/proxy.png)

Deploy the api and copy the a _invoke api_ url (found in stages on the left hand menu)

Paste the API_URL found in config.ts file

![](/markdown/newURL.png)

For running an development environment enter in the terminal

```
npm run dev
```
For a build enter:
```
npm run build
```
Then:
```
npm run preview
```
To view the build

![](/markdown/DeploymentUsage.svg)

Link to our demo video: https://www.youtube.com/watch?v=vtiya3kJqOw

- Home Page. This is what everyone sees when they first vist out website [Capitalise](https://www.capitalise.space/)
![](/markdown/DeploymentImages/homepage.png)
![](/markdown/DeploymentImages/homepage2.png)

- Ability anyone to search and filter projects
![](/markdown/DeploymentImages/searchFUnction.png)

- Students can upload a project
![](/markdown/DeploymentImages/uploadProject1.png)
![](/markdown/DeploymentImages/uploadProject2.png)
![](/markdown/DeploymentImages/uploadProject3.png)

- What a uploaded project looks like if you are not part of it
![](/markdown/DeploymentImages/projectDefault.png)

- What a uploaded project looks like if you are part of it. Notice the edit button
![](/markdown/DeploymentImages/projectEdit.png)

- A User profile for registered users
![](/markdown/DeploymentImages/userProfile.png)

- Customization to your own profile
![](/markdown/DeploymentImages/userProfile2.png)

- An Admin dashboard
![](/markdown/DeploymentImages/adminDashboard.png)

- Customizable admin features 
![](/markdown/DeploymentImages/adminUploadAward.png)

![](/markdown/FuturePlans.svg)

- **A super secret feature ~ codename: WAM**
  - Watch out for this
  
- **Further refactoring/optimization of logic**

- **Remove API gateway interaction with S3. Make client post directly to S3**
  - This will allow remove the size limit on files 
  
- **Dark mode**
  - Easy on the eyes
 
- **A search user function/feature**
  - This will allow anyone to find any user via the search bar
 
- **An admin view/edit user function**
  - This will allow an admin to view all users from the admin dashboard
  
- **A project share function**
  - Similar to the share function commonly found on social media
  
- **Client projects page where students can view the list of projects they can choose from during the beginning of the current semester**
  - This will then update to show what projects are in development and what teams are implementing them
  
- **A system that allows students to form teams and then add their top 3-5 projects they would like to do**
 
  
- **Clickable summary boxes for an admin that navigates to the header name e.g Categories**
  - This will make navigation easier and uphold the principle of big box means clickable


![](/markdown/Acknowledgements.svg)

**Special thanks to the AWS team at the University of Auckland**
  - Craig Barton
  - Ruskin
  - Nicolle Loh
  - Mahek Nangia

****
