import "./Profile.css";
import { useState } from "react";
import SideBar from "../SideBar/SideBar.jsx";
import ItemCard from "../ItemCard/ItemCard.jsx";
import { searchModels } from "../../utils/ThingiverseAPI";
import PropTypes from "prop-types";

function Profile({
  handleCardClick,
  onSignOut,
  handlEditProfileClick,
  handleCardLike,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [likedModels, setLikedModels] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchModels(searchTerm);
      const results = data.hits.map((model) => ({
        _id: model.id,
        name: model.name,
        image: model.thumbnail || "https://via.placeholder.com/150",
        likes: [],
        description: model.description || "No description available",
        url:
          model.public_url || `https://www.thingiverse.com/thing:${model.id}`,
      }));
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  const handleLike = (item) => {
    setLikedModels((prev) => {
      const isLiked = prev.find((m) => m._id === item._id);
      if (isLiked) {
        return prev.filter((m) => m._id !== item._id);
      } else {
        return [...prev, item];
      }
    });

    handleCardLike(item);
  };

  return (
    <div className="content-box">
      <div className="profile">
        <div className="profile__sidebar">
          <SideBar
            onSignOut={onSignOut}
            onEditProfile={handlEditProfileClick}
          />
        </div>
        <section className="profile__main">
          <form onSubmit={handleSearch} className="profile__search-form">
            <label htmlFor="search-input" className="profile__search-label">
              Search for 3D Models:
            </label>
            <input
              id="search-input"
              className="profile__search-input"
              type="text"
              placeholder="e.g., dog, spaceship..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="profile__search-button">
              Search
            </button>
          </form>

          <div className="profile__results">
            <h2>Search Results</h2>
            {searchResults.length > 0 ? (
              <ul className="cards__list">
                {searchResults.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onCardClick={() => handleCardClick(item)}
                    onCardLike={() => handleLike(item)}
                  />
                ))}
              </ul>
            ) : searchTerm ? (
              <p>No results found for &quot;{searchTerm}&quot;.</p>
            ) : null}
          </div>

          <div className="profile__liked">
            <h2>Liked Models</h2>
            {likedModels.length === 0 ? (
              <p>You haven&apos;t liked any models yet</p>
            ) : (
              <ul className="cards__list">
                {likedModels.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onCardClick={() => handleCardClick(item)}
                    onCardLike={() => handleLike(item)}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

Profile.propTypes = {
  handleCardClick: PropTypes.func.isRequired,
  handleAddClick: PropTypes.func, // make optional if you might remove it
  onSignOut: PropTypes.func.isRequired,
  handlEditProfileClick: PropTypes.func.isRequired, // if this is a typo, fix the prop/caller
  handleCardLike: PropTypes.func.isRequired,
};

export default Profile;
