import React from "react";
import styles from "./Form.module.css";

function OtherForm({ formArr, handleChange, isEdit }) {
  return (
    <div>
      {formArr.map((data) => (
        <div key={data.code} className={styles.formItem}>
          <label htmlFor={data.code} className={styles.formLabel}>
            {data.code}
          </label>
          {isEdit ? (
            <input
              type="text"
              name={data.code}
              value={data.name}
              onChange={handleChange}
              className={styles.formInput}
              readOnly={!isEdit}
            />
          ) : (
            <span className={styles.formText}>{data.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default OtherForm;
