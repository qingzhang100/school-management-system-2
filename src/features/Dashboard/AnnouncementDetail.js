import { Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/apiAnnouncements";
import Loader from "../../ui/Loader";
import EditContainer from "../../ui/Layout/EditContainer";
import styles from "../../components/Form/Form.module.css";
import MainTitle from "../../ui/MainTitle/MainTitle";

function AnnouncementDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [inputData, setInputData] = useState({
    Title: "",
    Content: "",
  });
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getAnnouncementById(id);
        setData(data);
        if (!data) {
          setNotFound(true);
          return;
        }
        if (data) {
          setInputData({
            Title: data.Title,
            Content: data.Content,
          });
        }
      } catch (error) {
        console.error("Failed to fetch Announcement data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (notFound) {
    return <Navigate to="/notfound" replace />;
  }

  function handleEdit() {
    setIsEdit(true);
  }

  function handleCancel() {
    setIsEdit(false);
    setInputData({
      Title: data.Title,
      Content: data.Content,
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleUpdate(event) {
    event.preventDefault();

    // Frontend validation for empty Title and Content
    if (!inputData.Title.trim()) {
      alert("Title cannot be empty.");
      return; // Prevent submission if Title is empty
    }

    if (!inputData.Content.trim()) {
      alert("Content cannot be empty.");
      return; // Prevent submission if Content is empty
    }

    try {
      const updatedAnnouncement = {
        Id: id,
        Title: inputData.Title,
        Content: inputData.Content,
        UserID: data.UserID,
        CreatedAt: data.CreatedAt,
      };

      const response = await updateAnnouncement(updatedAnnouncement);
      if (response) {
        setData((prevData) => ({
          ...prevData,
          Title: response.Title,
          Content: response.Content,
          UserID: response.UserID,
          Users: prevData.Users,
        }));
        setIsEdit(false);
      }
    } catch (error) {
      console.error("Failed to update Announcement:", error);
    }
  }

  async function handleDelete(announcementId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );
    if (confirmDelete) {
      try {
        await deleteAnnouncement(announcementId);
        alert("Announcement deleted successfully.");
        navigate("/dashboard/announcements");
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        alert("Failed to delete the announcement.");
      }
    }
  }

  return (
    <div>
      <MainTitle goBack={true} title="Announcement Detail" />
      <EditContainer
        title={data?.Title}
        editButtonText={role === "Admin" || role === "Advisor" ? "Edit" : false}
        onClickEdit={handleEdit}
        onClickCancel={handleCancel}
        onClickSave={handleUpdate}
        onClickDelete={
          role === "Admin" || role === "Advisor"
            ? () => handleDelete(data.Id)
            : false
        }
        isEdit={isEdit}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <form className={styles.form} onSubmit={handleUpdate}>
            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Title</label>
                {isEdit ? (
                  <input
                    type="text"
                    id="Title"
                    name="Title"
                    className={styles.formInput}
                    value={inputData.Title}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{inputData.Title}</span>
                )}
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Content</label>
                {isEdit ? (
                  <textarea
                    id="Content"
                    name="Content"
                    className={styles.formInput}
                    style={{ height: "30rem" }}
                    value={inputData.Content}
                    onChange={handleChange}
                  />
                ) : (
                  <pre className={styles.preStyle}>{inputData.Content}</pre>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Publisher</label>
                <span>{`${data?.Users?.FirstName} ${data?.Users?.LastName}`}</span>
              </div>
            </div>

            {/* CreatedAt */}
            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Created At</label>
                <span>{new Date(data?.CreatedAt).toLocaleString()}</span>
              </div>
            </div>
          </form>
        )}
      </EditContainer>
    </div>
  );
}

export default AnnouncementDetail;
