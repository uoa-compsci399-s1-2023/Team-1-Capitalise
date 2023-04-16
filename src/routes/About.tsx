import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../customHooks/useAuth";
import { useUserRole } from "../customHooks/useUserRole";

const About = () => {

  const auth = useAuth();

  const handleSignin = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uname = e.target.username.value;
    const password = e.target.password.value;
    auth.signin(uname, password)
  }

  const handleSignup = (e:React.FormEvent<HTMLFormElement>) => {
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
    auth.onlyAuthenticated();
    if (auth.user) {
      alert('liked!')
    }
  }

  return (
    <div className="About">
      {/* <Navbar /> */}
      <h1>About {auth.user?.name} </h1>
      <h3>{auth.error} </h3>
      <form onSubmit={handleSignin}>
        username: <input type="text" name="username" id="username" />
        password: <input type="text" name="password" />
        <input type="submit" value={"signin"}/>
        <input type="button" onClick={auth.signout} value={'signout'} />

      </form>

      <form onSubmit={handleSignup}>
        name: <input type="text" name="name" id="username" />
        email: <input type="text" name="email" id="username" />
        password: <input type="text" name="password" />
        <input type="submit" onClick={auth.signout} value={'signup'} />
      </form>
      
      <input type="button" onClick={handleLike} value={'Like'} />
    </div>


  );
};

export default About;
