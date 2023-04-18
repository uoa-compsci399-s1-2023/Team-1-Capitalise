import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../customHooks/useAuth";
import { Box } from "@mui/material";

let counter =0;

const About = () => {

  const auth = useAuth();


  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uname = e.target.username.value;
    const password = e.target.password.value;
    auth.signin(uname, password)
  }

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signupData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      username: e.target.email.value
    }
    auth.signup(signupData)
  }

  const handleLike = () => {
    auth.onlyAuthenticated(); // Redirects the use to the signin page if not signed in
    if (auth.user) { // Check if user is signed in 
      alert('liked!')
    }
  }

  const handleNotAllowed = () => {
    if (auth.isAllowed(['graduate'])) {
      alert('allowed')
    } else {
      alert('not allowed')
    }
  }

  return (
    <div className="About">
      <h1>{counter++}</h1>
      {auth.isLoading && <h1>Loading...</h1>}

      {/* <Navbar /> */}
      <h1>About {auth.user?.name} </h1>
      {auth.error && <h3>{auth.error}</h3>}

      <Box mb={6}>
        <form onSubmit={handleSignin}>
          username: <input type="text" name="username" id="username" />
          password: <input type="text" name="password" />
          <input type="submit" value={"signin"} />
          <input type="button" onClick={auth.signout} value={'signout'} />
        </form>
      </Box>

      <Box mb={6}>
        <form onSubmit={handleSignup}>
          name: <input type="text" name="name" id="username" />
          email: <input type="text" name="email" id="username" />
          password: <input type="text" name="password" />
          <input type="submit" onClick={auth.signout} value={'signup'} />
        </form>
      </Box>

      <input type="submit" onClick={() => auth.pauseTokenValidation()} value={'pause'} />
      <input type="submit" onClick={() => auth.resumeTokenValidation()} value={'resume'} />


      <Box mb={6}>
        <h1>Example 1: Something everyone sees. But only logged in users can use.</h1>
        <input type="button" onClick={handleLike} value={'Like'} />
      </Box>

      <Box mb={6}>
        <h1>Example 2: Something only visitors can see and use</h1>
        {auth.isAllowed(['visitor']) && <input type="button" value={'Create project'} />}
      </Box>

      <Box mb={6}>
        <h1>Example 3: Something only visitors, and graduates can see but only graduates can use</h1>
        {auth.isAllowed(['visitor', 'graduate']) && <input type="button" onClick={handleNotAllowed} value={'idk use case'} />}
      </Box>
    </div>


  );
};

export default About;
