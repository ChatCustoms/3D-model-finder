import "./Main.css";
import ItemCard from "../ItemCard/ItemCard"; // Can be renamed ModelCard later
import { useState } from "react";

function Main({ handleCardLike }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Replace with real Thingiverse API later
    const dummyResults = [
      {
        _id: "1",
        name: "Sample 3D Model",
        image: "https://via.placeholder.com/150",
        likes: [],
      },
    ];

    setSearchResults(dummyResults);
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
              />
            ))}
          </ul>
        ) : (
          <p className="cards__text">Search for models to get started.</p>
        )}
      </section>
    </main>
  );
}

export default Main;
