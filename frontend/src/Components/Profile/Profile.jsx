import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext.jsx";
import SideBar from "../SideBar/SideBar.jsx";

function Profile({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onSignOut,
  handlEditProfileClick,
  handleCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="profile">
      <SideBar onSignOut={onSignOut} onEditProfile={handlEditProfileClick} />
      <section className="profile__main">
        <ClothesSection
          clothingItems={clothingItems}
          handleCardClick={handleCardClick}
          handleAddClick={handleAddClick}
          handleCardLike={handleCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;
