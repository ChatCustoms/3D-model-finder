import "./LoginModal.css";
import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <ModalWithForm
      titleText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      hideDefaultButton={true}Ï
    >
      <label className="modal__label">
        Email
        <input
          id="login-email"
          className="modal__input"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </label>

      <label className="modal__label">
        Password
        <input
          id="login-password"
          className="modal__input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </label>

      <div className="modal__button-row">
        <button type="submit" className="modal__submit">
          Log In
        </button>
        <button type="button" className="modal__register" onClick={onRegister}>
          or Register
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;
