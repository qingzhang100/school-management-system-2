import styles from "./ModalContainer.module.css";

function ModalContainer({ title, children, onClose }) {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {children}
      </div>
    </>
  );
}

export default ModalContainer;
