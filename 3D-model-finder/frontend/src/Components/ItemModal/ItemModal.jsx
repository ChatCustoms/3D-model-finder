function ItemModal({ activeModal, card, onClose, onDelete }) {
  if (activeModal !== "preview") return null;

  return (
    <div className="modal">
      <h2>Model Preview</h2>
      <p>{card?.name}</p>
      <button onClick={() => onDelete(card._id)}>Delete</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ItemModal;
