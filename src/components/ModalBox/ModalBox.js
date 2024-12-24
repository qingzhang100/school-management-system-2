import React from "react";
import styles from "./ModalBox.module.css";
import Button from "../Button/Button";
import icons from "../../ui/Icons/icons";

const ModalBox = ({ handleCloseModal }) => {
  return (
    <div className={styles.popup}>
      {icons.CheckboxCircleIcon(styles.icon)}
      <h2>Congratulation!</h2>
      <p>A user account has been successfully created.</p>
      <Button className={styles.btn} onClickBtn={handleCloseModal}>
        <strong>OK</strong>
      </Button>
    </div>
  );
};

export default ModalBox;
