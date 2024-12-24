import React, { useState, useEffect } from "react";
import EditContainer from "../../ui/Layout/EditContainer";
import formStyles from "./Form.module.css";
import defaultAvatar from "../../assets/User-avatar-default.jpg";
import Button from "../Button/Button";
import {
  getProfileInfoByNo,
  UpdatePersonalInfo,
  UploadProfileImage,
  uploadImageURL,
  deleteUser,
} from "../../services/apiUser";
import Loader from "../../ui/Loader";
import { useNavigate } from "react-router-dom";

function PersonalInfoForm({ userNo, hideUpload, showDeleteButton = false }) {
  const [personalInfoData, setPersonalInfoData] = useState({
    RoleName: "",
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    HomeAddress: "",
    DateOfBirth: "",
    AvatarURL: "",
  });

  const [inputData, setInputData] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    HomeAddress: "",
    DateOfBirth: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfileInfoByNo(userNo);
        setPersonalInfoData({
          RoleName: profileData.Roles.RoleName || "",
          FirstName: profileData.FirstName || "",
          LastName: profileData.LastName || "",
          PhoneNumber: profileData.PhoneNumber || "",
          Email: profileData.Email || "",
          HomeAddress: profileData.HomeAddress || "",
          DateOfBirth: profileData.DateOfBirth || "",
          AvatarURL: profileData.AvatarURL || defaultAvatar,
        });
        setInputData({
          FirstName: profileData.FirstName || "",
          LastName: profileData.LastName || "",
          PhoneNumber: profileData.PhoneNumber || "",
          Email: profileData.Email || "",
          HomeAddress: profileData.HomeAddress || "",
          DateOfBirth: profileData.DateOfBirth || "",
        });
      } catch (error) {
        console.error("Error fetching profile info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userNo]);

  function validateForm() {
    const newErrors = {};

    // Check for empty fields
    if (!inputData.FirstName) newErrors.FirstName = "First Name is required.";
    if (!inputData.LastName) newErrors.LastName = "Last Name is required.";
    if (!inputData.PhoneNumber)
      newErrors.PhoneNumber = "Phone number is required.";
    if (!inputData.Email) newErrors.Email = "Email is required.";
    if (!inputData.DateOfBirth)
      newErrors.DateOfBirth = "Date of Birth is required.";
    if (!inputData.HomeAddress)
      newErrors.HomeAddress = "Home address is required.";

    // Email format check
    if (inputData.Email && !/\S+@\S+\.\S+/.test(inputData.Email)) {
      newErrors.Email = "Email is not valid.";
    }

    // Check if FirstName and LastName contain only letters
    const nameRegex = /^[A-Za-z]+$/;
    if (inputData.FirstName && !nameRegex.test(inputData.FirstName)) {
      newErrors.FirstName = "First Name must only contain letters.";
    }

    if (inputData.LastName && !nameRegex.test(inputData.LastName)) {
      newErrors.LastName = "Last Name must only contain letters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If no errors, form is valid
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleClickEdit(e) {
    e.preventDefault();
    setIsEdit((isEdit) => !isEdit);
  }

  function handleClickCancel(e) {
    e.preventDefault();
    setInputData(personalInfoData);
    setIsEdit(false);
    setErrors({});
  }

  async function handleClickSave() {
    try {
      if (!validateForm()) {
        return; // If form is invalid, do not save
      }

      if (imageFile) {
        await handleImageUpload();
      }
      const response = await UpdatePersonalInfo(userNo, inputData);
      setIsEdit(false);
      if (response) {
        alert("User information updated successfully!");
      } else {
        alert("Failed to update user information.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("An error occurred while saving the user data.");
    }
  }

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  function generateManualUrl(imagePath) {
    const url = `https://llcccnztkkxlkzblokbt.supabase.co/storage/v1/object/public/ProfileImage/${imagePath}`;
    console.log(url);
    return url;
  }

  const handleImageUpload = async () => {
    if (imageFile) {
      const uploadData = await UploadProfileImage(imageFile);
      if (uploadData) {
        const manualUrl = await generateManualUrl(uploadData.path);
        const url = await uploadImageURL(userNo, manualUrl);
        if (url) {
          setPersonalInfoData((prevData) => ({
            ...prevData,
            AvatarURL: url,
          }));
          alert("Image uploaded successfully!");
          window.location.reload();
        }
      } else {
        alert("Image upload failed.");
      }
    } else {
      alert("Please select an image to upload.");
    }
  };

  const handleImageRemove = async () => {
    if (personalInfoData.AvatarURL === defaultAvatar) {
      alert("You cannot remove the default avatar.");
      return;
    }

    const confirmRemove = window.confirm(
      "Are you sure you want to remove the profile picture?"
    );

    if (confirmRemove) {
      try {
        const url = await uploadImageURL(userNo, defaultAvatar);
        if (url) {
          setPersonalInfoData((prevData) => ({
            ...prevData,
            AvatarURL: defaultAvatar,
          }));
          alert("Profile picture removed successfully!");
          window.location.reload();
        } else {
          alert("Failed to remove profile picture.");
        }
      } catch (error) {
        console.error("Error removing profile picture:", error);
        alert("An error occurred while removing the profile picture.");
      }
    }
  };

  async function handleDelete(userNo) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await deleteUser(userNo);
        alert("User deleted successfully.");
        navigate("/users/user-list");
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete the user.");
      }
    }
  }

  return (
    <EditContainer
      title="Personal Information"
      editButtonText="Edit"
      isEdit={isEdit}
      onClickEdit={handleClickEdit}
      onClickSave={handleClickSave}
      onClickCancel={handleClickCancel}
      onClickDelete={
        showDeleteButton
          ? role === "Admin" || role === "Advisor"
            ? () => handleDelete(userNo)
            : false
          : false
      }
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className={formStyles.sectionLayout}>
          <div className={formStyles.avatar}>
            <img
              src={personalInfoData.AvatarURL || defaultAvatar}
              alt="user avatar"
            />
            {!hideUpload && (
              <div className={formStyles.upload}>
                <div className={formStyles.uploadChooseFile}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={formStyles.uploadInput}
                  />
                </div>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <Button onClickBtn={handleImageUpload}>Upload Picture</Button>
                  <Button onClickBtn={handleImageRemove} color="blue">
                    Remove Picture
                  </Button>
                </div>
              </div>
            )}
          </div>
          <form>
            <div className={formStyles.formRow}>
              <div className={formStyles.formItem}>
                <label htmlFor="role" className={formStyles.formLabel}>
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="RoleName"
                  className={formStyles.formInput}
                  readOnly
                  disabled
                  value={personalInfoData.RoleName}
                />
              </div>
              <div className={formStyles.formItem}>
                <label htmlFor="firstName" className={formStyles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="FirstName"
                  className={formStyles.formInput}
                  readOnly
                  disabled
                  value={inputData.FirstName}
                />
                {errors.FirstName && (
                  <span className={formStyles.errorText}>
                    {errors.FirstName}
                  </span>
                )}
              </div>
              <div className={formStyles.formItem}>
                <label htmlFor="lastName" className={formStyles.formLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="LastName"
                  className={formStyles.formInput}
                  readOnly
                  disabled
                  value={inputData.LastName}
                />
                {errors.LastName && (
                  <span className={formStyles.errorText}>
                    {errors.LastName}
                  </span>
                )}
              </div>
            </div>
            <div className={formStyles.formRow}>
              <div className={formStyles.formItem}>
                <label htmlFor="phone" className={formStyles.formLabel}>
                  Phone
                </label>
                <input
                  type="phone"
                  id="phone"
                  name="PhoneNumber"
                  className={formStyles.formInput}
                  disabled={!isEdit}
                  value={inputData.PhoneNumber}
                  onChange={handleChange}
                />
                {errors.PhoneNumber && (
                  <span className={formStyles.errorText}>
                    {errors.PhoneNumber}
                  </span>
                )}
              </div>
              <div className={formStyles.formItem}>
                <label htmlFor="email" className={formStyles.formLabel}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="Email"
                  className={formStyles.formInput}
                  disabled={!isEdit}
                  value={inputData.Email}
                  onChange={handleChange}
                />
                {errors.Email && (
                  <span className={formStyles.errorText}>{errors.Email}</span>
                )}
              </div>
            </div>
            <div className={formStyles.formItem}>
              <label htmlFor="dob" className={formStyles.formLabel}>
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="DateOfBirth"
                className={formStyles.formInput}
                disabled={!isEdit}
                value={inputData.DateOfBirth}
                onChange={handleChange}
              />
              {errors.DateOfBirth && (
                <span className={formStyles.errorText}>
                  {errors.DateOfBirth}
                </span>
              )}
            </div>
            <div className={formStyles.formItem}>
              <label htmlFor="address" className={formStyles.formLabel}>
                Home Address
              </label>
              <input
                type="text"
                id="address"
                name="HomeAddress"
                className={formStyles.formInput}
                disabled={!isEdit}
                value={inputData.HomeAddress}
                onChange={handleChange}
              />
              {errors.HomeAddress && (
                <span className={formStyles.errorText}>
                  {errors.HomeAddress}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </EditContainer>
  );
}

export default PersonalInfoForm;
