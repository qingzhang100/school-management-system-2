import React, { useState } from "react";
import formStyles from "../Form/Form.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import Button from "../../components/Button/Button.js";
import icons from "../../ui/Icons/icons.js";
import { updateLoginPassword } from "../../services/apiUser.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ResetPasswordWithoutCurrent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state;

  const [error, setError] = useState("");
  const [inputData, setInputData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleClickReset() {
    if (inputData.newPassword !== inputData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      const response = await updateLoginPassword(
        username,
        inputData.newPassword
      );

      console.log("response", response);
      if (response && response.error) {
        alert("Failed to update password.");
        console.error("Failed to update password:", response.error);
      } else {
        alert("Password updated successfully!");
        console.log("Password updated successfully!", response);
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving password data:", error);
      alert("An error occurred while saving data.");
    }
  }

  function handleClickCancel() {
    navigate(-1);
  }

  function handleUpdate(e) {
    const { name, value } = e.target;
    setInputData((prevInputData) => ({ ...prevInputData, [name]: value }));
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
      }}
    >
      <EditContainer title="Reset Password">
        <div className={formStyles.form}>
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="userName" className={formStyles.formLabel}>
                User Name
              </label>
              <div className={formStyles.passwordContainer}>
                <input
                  type="text"
                  id="userName"
                  name="username"
                  className={formStyles.formInput}
                  value={username}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="newPassword" className={formStyles.formLabel}>
                New Password
              </label>
              <div className={formStyles.passwordContainer}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className={formStyles.formInput}
                  value={inputData.newPassword}
                  onChange={handleUpdate}
                />
                <span
                  className={formStyles.eyeIcon}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? icons.EyeOff : icons.EyeOpen}
                </span>
              </div>
            </div>
          </div>
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="confirmPassword" className={formStyles.formLabel}>
                Confirm Password
              </label>
              <div className={formStyles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={formStyles.formInput}
                  value={inputData.confirmPassword}
                  onChange={handleUpdate}
                />
                <span
                  className={formStyles.eyeIcon}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? icons.EyeOff : icons.EyeOpen}
                </span>
              </div>
            </div>
          </div>
          <div className={formStyles.bottomButtons}>
            <Button onClickBtn={handleClickReset}>Reset</Button>
            <Button onClickBtn={handleClickCancel}>Cancel</Button>
          </div>
        </div>
      </EditContainer>
    </div>
  );
}

export default ResetPasswordWithoutCurrent;
