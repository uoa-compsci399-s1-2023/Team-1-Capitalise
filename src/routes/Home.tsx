import "./Home.css";
import logo from "../assets/Logo.svg";
import Navbar from "../components/Navbar/Navbar";
import MyButton from "../components/MyButton";

function Home() {
  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <img className="logo" src={logo} alt="logo"></img>
      </div>
    </div>
  );
}

export default Home;
