import "./ModalWithForm.css";
import CloseIcon from "../../assets/CloseIcon.svg";

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
        <button className="modal__close" type="button" onClick={onClose}>
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

export default ModalWithForm;
