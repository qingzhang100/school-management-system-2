import React, { useState, useEffect } from "react";
import Button from "../Button/Button.js";
import EditContainer from "../../ui/Layout/EditContainer.js";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import { addAnnouncement } from "../../services/apiAnnouncements.js";
import { getUnreadAnnouncementsCount } from "../../services/apiAnnouncements.js";
import { useUnreadCount } from "../../contexts/UnreadContext";

function NewAnnouncementForm() {
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const [inputData, setInputData] = useState({
    Title: "",
    Content: "",
    CreatedAt: new Date().toLocaleDateString("en-CA"),
    UserID: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const UserID = localStorage.getItem("UserID");

    try {
      await addAnnouncement({ ...inputData, UserID });
      const userNo = localStorage.getItem("loginUserNo");
      const unreadCount = await getUnreadAnnouncementsCount(userNo);
      setUnreadCount(unreadCount);
      navigate("/dashboard/announcements");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <EditContainer>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="Title" className={styles.formLabel}>
              Title
            </label>
            <input
              type="text"
              name="Title"
              value={inputData.Title}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="Content" className={styles.formLabel}>
              Content
            </label>
            <textarea
              name="Content"
              value={inputData.Content}
              onChange={handleChange}
              className={styles.formInput}
              rows={20}
              style={{ height: "auto" }}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="CreatedAt" className={styles.formLabel}>
              Created At
            </label>
            <input
              type="date"
              name="CreatedAt"
              value={inputData.CreatedAt}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <Button size="large">Submit</Button>
          <Button
            size="large"
            onClickBtn={() => {
              console.log("Cancel button clicked");
              navigate("/dashboard/announcements");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </EditContainer>
  );
}

export default NewAnnouncementForm;
