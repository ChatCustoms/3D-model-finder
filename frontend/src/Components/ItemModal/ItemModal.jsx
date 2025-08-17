import "./ItemModal.css";

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
        {onDelete && <button onClick={() => onDelete(item._id)}>🗑 Delete</button>}
      </div>
    </div>
  );
}

export default ItemModal;