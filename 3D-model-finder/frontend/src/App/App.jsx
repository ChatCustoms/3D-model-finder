import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Main from "../Main/Main.jsx";
import Profile from "../Profile/Profile.jsx";
import Login from "../Login/Login.jsx";
import Register from "../Register/Register.jsx";

functions App() {
  const currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const hnadleModalClose = () => {
    setActiveModal("");
  };

  const handleLogin = (email, password) => {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        auth.checkToken(res.token).then((user) => {
          setCurrentUser(user);
          setLoggedIn(true);
          handleModalClose();
        });
      })
      .catch(console.error);
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
  const handleCardLike = ({ _id, likes }) => {
    const token = localStorage.getItem("jwt");

    if (!currentUser || !currentUser._id || !token) {
      console.error("User not logged in or token missing");
      return;
    }

    const isLiked = likes.includes(currentUser._id);

    const request = isLiked ? api.removeCardLike : api.addCardLike;

    request(_id, token)
      .then((updatedCard) => {
        setClothingItems((cards) =>
          cards.map((item) => (item._id === _id ? updatedCard : item))
        );
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
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="app">
            <div className="app__content">
              <Header
                handleAddClick={handleAddClick}
                weatherData={weatherData}
                onLogin={openLoginModal}
                onRegister={openRegisterModal}
              />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Main
                        weatherData={weatherData}
                        handleCardClick={handleCardClick}
                        clothingItems={clothingItems}
                        handleCardLike={handleCardLike}
                      />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute
                      loggedIn={loggedIn}
                      element={
                        <Profile
                          onSignOut={handleSignOut}
                          loggedIn={loggedIn}
                          clothingItems={clothingItems}
                          handleCardClick={handleCardClick}
                          handleAddClick={handleAddClick}
                          handlEditProfileClick={() =>
                            setActiveModal("edit-profile")
                          }
                          handleCardLike={handleCardLike}
                        />
                      }
                    />
                  }
                />
              </Routes>
            </div>
            <AddItemModal
              isOpen={activeModal === "add-garment"}
              onClose={handleModalClose}
              onAddItemModalSubmit={handleAddItemModalSubmit}
            />
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
        </CurrentTemperatureUnitContext.Provider>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
