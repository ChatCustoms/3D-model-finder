import { useContext, useEffect, useState } from "react";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import { updateProfile } from "../../utils/api";
import "./About.css";

const About = () => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    updateProfile({ name, avatar }, token)
      .then(() => {
        setMessage("Profile updated!");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Update failed.");
      });
  };

  return (
    <div className="about">
      <h2>About Me</h2>
      <form onSubmit={handleSubmit} className="about__form">
        <label className="about__label">
          Name:
          <input
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="about__label">
          Avatar URL:
          <input
            type="url"
            value={avatar}
            placeholder="https://..."
            onChange={(e) => setAvatar(e.target.value)}
          />
        </label>
        <button type="submit">Update Profile</button>
        {message && <p className="about__message">{message}</p>}
      </form>
      <div className="about__info">
        <h1>Current User Info:</h1>
        <p>Name: {currentUser?.name || "N/A"}</p>
        <p>Avatar: {currentUser?.avatar || "N/A"}</p>
      </div>
      <div className="about__info">
        <h1>About This App</h1>
        <p>
          This app helps you search 3D models from Thingiverse and manage your
          favorites.
        </p>
        <p>Created by Stephano Chatham as a full-stack project.</p>
        <p>Feel free to explore and contribute!</p>
      </div>
    </div>
  );
};

export default About;
