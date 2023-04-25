import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../customHooks/useAuth";
import { Box } from "@mui/material";

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
      // username: e.target.email.value
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
    if (auth.isAllowed(['graduate'], ['6432f85f6cce2fc1706572cf'])) {
      alert('allowed')
    } else {
      alert('not allowed')
    }
  }

  console.log(auth.user?._id)

  return (
    <div className="About">
      {/* {auth.isLoading && <h1>Loading...</h1>} */}

      {/* <Navbar /> */}
      <h1>About</h1>
      {/* {auth.error && <h3>{auth.error}</h3>}

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
      </Box> */}
    </div>


  );
};

export default About;
