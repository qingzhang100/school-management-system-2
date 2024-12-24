import React, { useState } from "react";
import icons from "../../ui/Icons/icons";
import styles from "./Button.module.css";
import Button from "./Button";

function SelectButton({ options, onSelect, label = "Sort By" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleButtonClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={styles.dropdownContainer}>
      <Button
        className={styles.sortButton}
        onClickBtn={handleButtonClick}
        size="large"
      >
        {`${label}: ${selectedOption}`}&nbsp;&nbsp;
        {icons.ArrowDownIcon(styles.arrowDown)}
      </Button>

      {isDropdownOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          <div className={styles.dropdown}>
            {options.map((option, index) => (
              <div
                key={index}
                className={`${styles.dropdownItem} ${
                  selectedOption === option ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedOption(option);
                  setIsDropdownOpen(false);
                  onSelect(option.replace(/\s/g, ""));
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SelectButton;
