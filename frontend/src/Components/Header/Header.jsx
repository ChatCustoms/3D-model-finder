import "./Header.css";
import logo from "../../assets/Header_logo.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../Contexts/CurrentUserContext.jsx";
import PropTypes from "prop-types";

function Header({ onLogin, onRegister }) {
  // Pull the actual user object out of the context wrapper
  const ctx = useContext(CurrentUserContext) || { currentUser: null };
  const user = ctx.currentUser;

  console.log("Header - currentUser:", ctx);

  const isLoggedIn = !!user;
  const displayName = user?.name ?? "";
  const avatarUrl = user?.avatar ?? "";
  const initial =
    String(displayName ?? "")
      .trim()
      .slice(0, 1)
      .toUpperCase() || "?";

  return (
    <header className="header">
      <div className="content-box">
        <div className="header__container">
          <Link to="/">
            <img className="header__logo" src={logo} alt="ChatCustoms" />
          </Link>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="header__auth-buttons">
          <button type="button" className="header__login-btn" onClick={onLogin}>
            Log In
          </button>
          <button
            type="button"
            className="header__register-btn"
            onClick={onRegister}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <Link to="/profile" className="header__user-container">
          <p className="header__username">{displayName || "Profile"}</p>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || "User avatar"}
              className="header__avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="header__avatar-placeholder">{initial}</div>
          )}
        </Link>
      )}
    </header>
  );
}

Header.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

export default Header;
