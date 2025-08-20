import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { updateProfile } from "../../utils/api.js";
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

  const handleLogin = (email, password) => {
    // auth
    //   .login(email, password)
    //   .then((res) => {
    //     localStorage.setItem("jwt", res.token);
    //     setLoggedIn(true);
    //     auth.checkToken(res.token).then((user) => {
    //       setCurrentUser(user);
    //       setLoggedIn(true);
    //       handleModalClose();
    //     });
    //   })
    //   .catch(console.error);
    const fakeUser = {
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      email,
      _id: "12345",
    };
    setCurrentUser(fakeUser);
    setLoggedIn(true);

    localStorage.setItem("jwt", "dev-token");

    handleModalClose();
  };

  const handleRegister = ({ name, avatar, email, password }) => {
    const userData = {
      name,
      avatar,
      email,
      password,
    };
    const loginData = {
      email,
      password,
    };
    auth
      .register(userData)
      .then(() => handleLogin(loginData))
      .catch(console.error);
  };
  const handleCardLike = ({ _id, likes = [] }) => {
    const token = localStorage.getItem("jwt");

    if (!currentUser || !currentUser._id || !token) {
      console.error("User not logged in or token missing");
      return;
    }

    const isLiked = Array.isArray(likes) && likes.includes(currentUser._id);
    const request = isLiked ? api.removeCardLike : api.addCardLike;

    request(_id, token)
      .then((updatedCard) => {
        console.log("Card updated successfully:", updatedCard);
      })
      .catch(console.error);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setLoggedIn(false);
    handleModalClose();
  };

  const handleUpdateUser = (userData) => {
    const token = localStorage.getItem("jwt");
    updateProfile(userData, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleModalClose();
      })
      .catch(console.error);
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
          console.error(err);
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
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
                  <About onEditProfile={() => setActiveModal("edit-profile")} />
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
