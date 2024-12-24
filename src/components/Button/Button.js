import styles from "./Button.module.css";

function Button({
  children,
  onClickBtn,
  onClickEditBtn,
  size = "small",
  color = "rose",
}) {
  const handleClick = (e) => {
    if (onClickBtn) {
      onClickBtn(e);
    }
    if (onClickEditBtn) {
      onClickEditBtn(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.btn} ${styles[size]} ${styles[color]}`}
    >
      {children}
    </button>
  );
}

export default Button;
