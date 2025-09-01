import "./ItemCard.css";
import PropTypes from "prop-types";

function ItemCard({ item, onCardLike, onCardClick }) {
  const handleLike = () => {
    onCardLike(item);
  };

  return (
    <li className="item-card" onClick={onCardClick}>
      <img src={item.image} alt={item.name} className="item-card__image" />
      <h3 className="item-card__title">{item.name}</h3>
      <button className="item-card__like-btn" onClick={handleLike}>
        ❤️ Like
      </button>
    </li>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    image: PropTypes.string, // url
    liked: PropTypes.bool,
  }).isRequired,
  onCardLike: PropTypes.func.isRequired, // (item) => void
  onCardClick: PropTypes.func.isRequired, // (item) => void
};

export default ItemCard;
