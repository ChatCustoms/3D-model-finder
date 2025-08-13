import "./ItemCard.css";

function ItemCard({ item, onCardLike }) {
  const handleLike = () => {
    onCardLike(item);
  };

  return (
    <li className="item-card">
      <img src={item.image} alt={item.name} className="item-card__image" />
      <h3 className="item-card__title">{item.name}</h3>
      <button className="item-card__like-btn" onClick={handleLike}>
        ❤️ Like
      </button>
    </li>
  );
}

export default ItemCard;