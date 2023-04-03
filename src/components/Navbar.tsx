import React from "react";
import logo from "../assets/Logo.svg";
import styles from "./Navbar.module.css";
import MyButton from "./MyButton";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.Navagation}>
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
        <div className={styles.Links}>
          <a>Projects</a>
          <a href="/About">About</a>
        </div>
      </div>
      <div className={styles.InputSection}>
        <SearchBar></SearchBar>
        <MyButton variant="outlined" onClick={() => {}}>
          log in
        </MyButton>
        <MyButton variant="contained" onClick={() => {}}>
          Sign Up
        </MyButton>
      </div>
    </div>
  );
};

export default Navbar;
