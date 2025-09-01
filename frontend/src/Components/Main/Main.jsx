import "./Main.css";
import ItemCard from "../ItemCard/ItemCard";
import ItemModal from "../ItemModal/ItemModal";
import { useEffect, useState } from "react";
import { searchModels } from "../../utils/ThingiverseAPI";
import PropTypes from "prop-types";

import { API_BASE } from "../../utils/api";

function Main({ handleCardLike }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  const handleCardClick = (model) => setSelectedModel(model);
  const handleCloseModal = () => setSelectedModel(null);

  useEffect(() => {
    console.log("API_BASE (from bundle):", API_BASE);
    window.__API_BASE__ = API_BASE; // For debugging
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchModels(searchTerm);
      const results = data.hits || [];

      const formattedResults = results.map((m) => {
        const rawThumb =
          m.thumbnail ||
          m.preview_image ||
          m.thumbnail_960_url ||
          m.thumbnail_625_url ||
          m.public_url; // last-ditch fallback

        const image = rawThumb
          ? `${API_BASE}/api/thingiverse/img?url=${encodeURIComponent(
              rawThumb
            )}`
          : "https://via.placeholder.com/300x200?text=No+Image";

        return {
          _id: m.id,
          name: m.name,
          image,
          likes: [],
          description: m.description || "No description available",
          url: m.public_url || `https://www.thingiverse.com/thing:${m.id}`,
        };
      });

      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  return (
    <main>
      <div className="content-box">
        <section className="search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search 3D models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </section>

        <section className="cards">
          {searchResults.length > 0 ? (
            <ul className="cards__list">
              {searchResults.map((item) => (
                <ItemCard
                  key={item._id ?? item.id}
                  item={item}
                  onCardLike={() => handleCardLike(item)}
                  onCardClick={() => handleCardClick(item)}
                />
              ))}
            </ul>
          ) : (
            <p className="cards__text">Search for models to get started.</p>
          )}
        </section>
      </div>

      {selectedModel && (
        <ItemModal
          activeModal="preview"
          model={selectedModel}
          onClose={handleCloseModal}
          onLike={() => handleCardLike(selectedModel)}
        />
      )}
    </main>
  );
}

Main.propTypes = {
  handleCardLike: PropTypes.func.isRequired,
};

export default Main;
