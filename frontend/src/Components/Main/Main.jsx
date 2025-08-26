import "./Main.css";
import ItemCard from "../ItemCard/ItemCard";
import ItemModal from "../ItemModal/ItemModal";
import { useState } from "react";
import { searchModels } from "../../utils/ThingiverseAPI";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // <-- add this

function Main({ handleCardLike }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  const handleCardClick = (model) => {
    console.log("Card clicked:", model);
    setSelectedModel(model);
  };

  const handleCloseModal = () => setSelectedModel(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const data = await searchModels(searchTerm);
      const results = data.hits || [];

      // Map results to your UI's expected format
      const formattedResults = results.map((model) => {
        const imgUrl = model.thumbnail
          ? `${API_BASE}/api/thingiverse/img?url=${encodeURIComponent(
              model.thumbnail
            )}`
          : "https://via.placeholder.com/150";

        return {
          _id: model.id,
          name: model.name,
          image: imgUrl,
          likes: [],
          description: model.description || "No description available",
          url:
            model.public_url || `https://www.thingiverse.com/thing:${model.id}`,
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
                key={item._id}
                item={item}
                onCardLike={handleCardLike}
                onCardClick={() => handleCardClick(item)}
              />
            ))}
          </ul>
        ) : (
          <p className="cards__text">Search for models to get started.</p>
        )}
      </section>

      {selectedModel && (
        <ItemModal
          activeModal="preview"
          model={selectedModel}
          onClose={handleCloseModal}
          onLike={handleCardLike}
        />
      )}
    </main>
  );
}

export default Main;
