import "./About.css";
import { useContext } from "react";
import CurrentUserContext from "../Contexts/CurrentUserContext.jsx";

function About({ onEditProfile }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="about">
      <h2>About Me</h2>
      <div className="about__info">
        <img
          src={currentUser?.avatar || "https://via.placeholder.com/150"}
          alt="User Avatar"
          className="about__avatar"
        />
        <p>
          <strong>Name:</strong> {currentUser?.name}
        </p>
        <p>
          <strong>Email:</strong> {currentUser?.email}
        </p>
      </div>
      <button className="about__edit-btn" onClick={onEditProfile}>
        Edit Profile
      </button>
    </div>
  );
}

export default About;
