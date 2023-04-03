import "./Home.css";
import Logo from "../assets/Logo.svg";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Home() {
  const [logoVisability, setLogoVisability] = useState(false);

  const handleImageClick = () => {
    setLogoVisability(!logoVisability);
  };

  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <img
          className={logoVisability ? "logo" : "logoHide"}
          src={Logo}
          alt="logo"
          onClick={handleImageClick}
        ></img>
      </div>
    </div>
  );
}

export default Home;
