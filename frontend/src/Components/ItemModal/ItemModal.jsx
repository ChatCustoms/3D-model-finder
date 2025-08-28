import "./ItemModal.css";
import PropTypes from "prop-types";

function ItemModal({ activeModal, model, card, onClose, onDelete, onLike }) {
  if (activeModal !== "preview") return null;

  const item = model || card;
  if (!item) return null;

  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>

        {item.image && <img src={item.image} alt={item.name} />}
        <h2>{item.name}</h2>

        {item.description && (
          <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
        )}

        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            View on Thingiverse
          </a>
        )}

        {onLike && <button onClick={() => onLike(item._id)}>❤️ Like</button>}
        {onDelete && (
          <button onClick={() => onDelete(item._id)}>🗑 Delete</button>
        )}
      </div>
    </div>
  );
}

ItemModal.propTypes = {
  activeModal: PropTypes.bool.isRequired,
  model: PropTypes.object, // if you really use `model`, otherwise drop this prop
  card: PropTypes.object, // the selected item/card (can be null when closed)
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func, // optional
  onLike: PropTypes.func, // optional
};

export default ItemModal;
