import { useContext } from "react";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import "./SideBar.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SideBar = ({ onEditProfile, onSignOut }) => {
  const currentUser = useContext(CurrentUserContext);
  console.log("Rendering SideBar:", currentUser);

  return (
    <div className="sidebar profile__sidebar">
      <div className="content-box">
        <button className="sidebar__edit-button" onClick={onEditProfile}>
          Edit Profile
        </button>

        <Link to="/about" className="sidebar__aboutme-button">
          About Me
        </Link>

        <button className="sidebar__signout-button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

SideBar.propTypes = {
  onEditProfile: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
};

export default SideBar;
