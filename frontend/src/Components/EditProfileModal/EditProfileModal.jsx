import { useContext, useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import CurrentUserContext from "../Contexts/CurrentUserContext";

const EditProfileModal = ({ isOpen, onClose, onUpdateUser }) => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [currentUser, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ name, avatar }).catch(() =>
      setErrorMsg("Update failed. Please try again.")
    );
  };

  return (
    <ModalWithForm
      titleText="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name
        <input
          className="modal__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="modal__label">
        Avatar URL
        <input
          className="modal__input"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          required
        />
      </label>

      {errorMsg && <p className="modal__error">{errorMsg}</p>}

      <button type="submit" className="modal__submit">
        Save Changes
      </button>
    </ModalWithForm>
  );
};

export default EditProfileModal;
