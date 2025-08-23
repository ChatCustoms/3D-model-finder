import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email and password are required");
      return;
    }

    try {
      await onLogin(email, password); // returns a Promise (see above)
    } catch (err) {
      setErrorMsg(err?.message || "Invalid email or password");
    }
  };

  return (
    <ModalWithForm
      titleText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      hideDefaultButton={true}
    >
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
          Log In
        </button>
        <p className="modal__switch">
          or{" "}
          <button
            type="button"
            className="modal__link"
            onClick={() => {
              setErrorMsg("");
              onRegister();
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;
