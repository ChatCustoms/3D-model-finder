import "./ModalWithForm.css";
import CloseIcon from "../../assets/CloseIcon.svg";
import PropTypes from "prop-types";

function ModalWithForm({
  children,
  titleText,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
  hideDefaultButton = false,
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{titleText}</h2>
        <button className="form__close" type="button" onClick={onClose}>
          <img src={CloseIcon} alt="Close" />
        </button>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          {!hideDefaultButton && (
            <button className="modal__submit" type="submit">
              {buttonText}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

ModalWithForm.propTypes = {
  children: PropTypes.node,
  titleText: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  hideDefaultButton: PropTypes.bool,
};

export default ModalWithForm;
