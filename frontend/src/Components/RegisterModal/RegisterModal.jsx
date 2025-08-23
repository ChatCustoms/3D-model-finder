import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

const RegisterModal = ({ isOpen, onClose, onRegister, onLogin }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onRegister !== "function") {
      console.error("onRegister is not a function");
      return;
    }

    onRegister({ name, avatar, email, password })
      .then(() => {
        setErrorMsg(""); // clear any previous error
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        setErrorMsg("Registration failed. Please check your info.");
      });
  };

  return (
    <ModalWithForm
      titleText="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      hideDefaultButton={true}
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

      <label className="modal__label">
        Email
        <input
          className="modal__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="modal__label">
        Password
        <input
          className="modal__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {errorMsg && <p className="modal__error">{errorMsg}</p>}

      <div className="modal__footer">
        <button type="submit" className="modal__submit">
          Sign Up
        </button>
        <p className="modal__switch">
          or{" "}
          <button
            type="button"
            className="modal__link"
            onClick={() => {
              setErrorMsg("");
              onLogin();
            }}
          >
            Log In
          </button>
        </p>
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
