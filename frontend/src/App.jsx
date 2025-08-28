import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import auth from "./utils/auth.js";
import * as api from "./utils/api.js";
import About from "./Components/About/About.jsx";
import CurrentUserContext from "./Components/Contexts/CurrentUserContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import LoginModal from "./Components/LoginModal/LoginModal.jsx";
import RegisterModal from "./Components/RegisterModal/RegisterModal.jsx";
import EditProfileModal from "./Components/EditProfileModal/EditProfileModal.jsx";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Main from "./Components/Main/Main.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import ItemModal from "./Components/ItemModal/ItemModal.jsx";
import { login, checkToken } from "./utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleModalClose = () => {
    setActiveModal("");
  };

  const handleLogin = async (email, password) => {
    // throws on error if your helper rejects on !res.ok
    const { token } = await login({ email, password });
    localStorage.setItem("jwt", token);

    const user = await checkToken(token); // GET /api/users/me
    setCurrentUser(user);
    setLoggedIn(true);
    // close modal, navigate, etc.
    handleModalClose();

    return token; // return something so callers can await if they want
  };

  const handleRegister = ({ name, avatar, email, password }) => {
    return auth
      .register({ name, avatar, email, password })
      .then(() => {
        return auth.login({ email, password });
      })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return auth.checkToken(data.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        setLoggedIn(true);
        handleModalClose();
      });
  };

  const handleCardLike = (item = {}) => {
    const token = localStorage.getItem("jwt");

    if (!currentUser || !currentUser._id || !token) {
      console.error("User not logged in or token missing");
      return;
    }

    // Accept both shapes: Thingiverse search results (id) and normalized (_id)
    const externalId =
      item?._id ?? item?.id ?? item?.thing_id ?? item?.thingId ?? null;

    if (!externalId) {
      console.warn("No externalId found on item:", item);
      return; // prevent /items/undefined/likes
    }

    // Likes array may not exist for raw search results — default to []
    const likes = Array.isArray(item.likes) ? item.likes : [];
    const isLiked = likes.includes(currentUser._id);

    // Use POST to like, DELETE to unlike (avoid PUT that your server doesn't implement)
    const request = isLiked ? api.removeCardLike : api.addCardLike;

    request(externalId, token)
      .then((updated) => {
        console.log("Card updated successfully:", updated);
        // TODO: update UI state if needed (e.g., refetch or optimistic update)
      })
      .catch((err) => {
        console.error("Like toggle failed:", err);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setLoggedIn(false);
    handleModalClose();
  };

  const handleUpdateUser = (userData) => {
    const token = localStorage.getItem("jwt");
    return updateProfile(userData, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleModalClose();
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  const handleDelete = (cardId) => {
    const token = localStorage.getItem("jwt");
    api
      .deleteCard(cardId, token)
      .then(() => {
        console.log("Card deleted:", cardId);
        handleModalClose();
      })
      .catch(console.error);
  };

  const openLoginModal = () => {
    setActiveModal("login");
  };

  const openRegisterModal = () => {
    setActiveModal("register");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((user) => {
          setCurrentUser(user);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          localStorage.removeItem("jwt");
          setCurrentUser(null);
          setLoggedIn(false);
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <BrowserRouter basename="/">
        <div className="app">
          <div className="app__content">
            <Header onLogin={openLoginModal} onRegister={openRegisterModal} />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Main handleCardLike={handleCardLike} />
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    <Profile
                      onSignOut={handleSignOut}
                      loggedIn={loggedIn}
                      handleCardClick={handleCardClick}
                      handlEditProfileClick={() =>
                        setActiveModal("edit-profile")
                      }
                      handleCardLike={handleCardLike}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    <About
                      onEditProfile={() => setActiveModal("edit-profile")}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={handleModalClose}
            onDelete={handleDelete}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={handleModalClose}
            onUpdateUser={handleUpdateUser}
          />
          <Footer />
          <LoginModal
            isOpen={activeModal === "login"}
            onOpen={openLoginModal}
            onClose={handleModalClose}
            onLogin={handleLogin}
            onRegister={openRegisterModal}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onOpen={openRegisterModal}
            onClose={handleModalClose}
            onRegister={handleRegister}
            onLogin={openLoginModal}
          />
        </div>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
