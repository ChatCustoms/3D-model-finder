import "./SideBar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ onEditProfile, onSignOut }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="sidebar">
      <div className="sidebar__user-info">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="sidebar__avatar"
          />
        ) : (
          <div className="sidebar__avatar-placeholder">
            {currentUser?.name?.charAt(0)}
          </div>
        )}
        <p className="sidebar__username">{currentUser?.name}</p>
      </div>
      <button className="sidebar__edit-button" onClick={onEditProfile}>
        Change profile data
      </button>
      <button className="sidebar__signout-button" onClick={onSignOut}>
        Log out
      </button>
    </div>
  );
}

export default SideBar;
