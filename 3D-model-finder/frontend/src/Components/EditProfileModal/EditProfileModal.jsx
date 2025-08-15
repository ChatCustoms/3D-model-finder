import React, { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./EditProfileModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const EditProfileModal = ({ isOpen, onClose, onUpdateUser }) => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [currentUser, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ name, avatar });
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      title="Change profile data"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Save changes"
    >
      <label className="modal__label">
        Name*
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="modal__input"
        />
      </label>
      <label className="modal__label">
        Avatar
        <input
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="modal__input"
        />
      </label>
    </ModalWithForm>
  );
};

export default EditProfileModal;
