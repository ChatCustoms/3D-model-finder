import { useContext } from "react";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import "./SideBar.css";
import { Link } from "react-router-dom";

const SideBar = ({ onEditProfile, onSignOut }) => {
  const currentUser = useContext(CurrentUserContext);
    console.log("Rendering SideBar:", currentUser);

  return (
    <div className="sidebar profile__sidebar">

      <button className="sidebar__edit-button" onClick={onEditProfile}>
        Edit Profile
      </button>

      <Link to="/about" className="sidebar__edit-button">
        About Me
      </Link>

      <button className="sidebar__signout-button" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default SideBar;
