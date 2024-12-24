import React, { useState, useEffect } from "react";
import Button from "../Button/Button.js";
import styles from "./Form.module.css";
import {
  CreateMultipleUsers,
  CreateUser,
  checkUsernameExists,
  getUserIdByUsername,
} from "../../services/apiUser.js";
import {
  addStudent,
  createStudentByUserId,
} from "../../services/apiStudent.js";
import { createTeacherByUserId } from "../../services/apiTeacher.js";
import EditContainer from "../../ui/Layout/EditContainer.js";
import ModalBox from "../ModalBox/ModalBox.js";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const initialInputData = {
  UserName: "",
  PasswordHash: "",
  ConfirmPassword: "",
  FirstName: "",
  LastName: "",
  DateOfBirth: "",
  PhoneNumber: "",
  HomeAddress: "",
  IsAdmin: false,
  RoleName: "",
  SecurityQuestion: "",
  SecurityAnswer: "",
  Email: "",
};

function ProfileForm({ type, formData, isEdit, onFormSubmit }) {
  const [inputData, setInputData] = useState(initialInputData);
  const [excelData, setExcelData] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (formData && formData.Users) {
      setInputData({
        UserName: formData.Users.UserName || "",
        PasswordHash: formData.Users.PasswordHash || "",
        ConfirmPassword: "",
        FirstName: formData.Users.FirstName || "",
        LastName: formData.Users.LastName || "",
        DateOfBirth: formData.Users.DateOfBirth || "",
        PhoneNumber: formData.Users.PhoneNumber || "",
        HomeAddress: formData.Users.HomeAddress || "",
        IsAdmin: formData.Users.IsAdmin || false,
        RoleName: formData.Users.RoleName || "",
        SecurityQuestion: formData.Users.SecurityQuestion || "",
        SecurityAnswer: formData.Users.SecurityAnswer || "",
        Email: formData.Users.Email || "",
      });
    }
  }, [formData]);

  // Modal functionality
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    navigate("/users/user-list");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    var reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rawData.length < 2) {
        console.error("No data rows found in Excel file.");
        return;
      }

      const headers = rawData[0];
      const dataRows = rawData.slice(1);
      const formattedData = dataRows.map((row) => {
        const rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header] = row[index];
        });
        return rowObj;
      });
      setExcelData(formattedData);
    };
    reader.onerror = () => {
      console.error("Failed to read file");
    };
    reader.readAsArrayBuffer(file);
  }

  function insertDataExcel(e) {
    e.preventDefault();
    CreateMultipleUsers(excelData)
      .then((response) => {
        if (response === true) handleOpenModal();
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });
  }

  async function handleCheckUsername(username) {
    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        alert("Username already exists. Please choose another one.");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Failed to check username:", error);
    }
  }

  // Validation function for all fields
  function validateForm() {
    const newErrors = {};

    // Check for empty fields
    if (!inputData.UserName) newErrors.UserName = "Username is required.";
    if (!inputData.PasswordHash)
      newErrors.PasswordHash = "Password is required.";
    if (inputData.ConfirmPassword !== inputData.PasswordHash)
      newErrors.ConfirmPassword = "Passwords do not match.";
    if (!inputData.FirstName) newErrors.FirstName = "First Name is required.";
    if (!inputData.LastName) newErrors.LastName = "Last Name is required.";
    if (!inputData.Email) newErrors.Email = "Email is required.";
    if (!inputData.RoleName) newErrors.RoleName = "Role is required.";
    if (!inputData.DateOfBirth)
      newErrors.DateOfBirth = "Date of Birth is required.";
    if (!inputData.PhoneNumber)
      newErrors.PhoneNumber = "Phone number is required.";
    if (!inputData.HomeAddress)
      newErrors.HomeAddress = "Home address is required.";
    if (!inputData.SecurityQuestion)
      newErrors.SecurityQuestion = "Security question is required.";
    if (!inputData.SecurityAnswer)
      newErrors.SecurityAnswer = "Security answer is required.";

    // Password length check
    if (inputData.PasswordHash && inputData.PasswordHash.length < 6) {
      newErrors.PasswordHash = "Password must be at least 6 characters.";
    }

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return; // If form is invalid, do not proceed
    }

    // Proceed with form submission logic if valid
    const ans = await handleCheckUsername(inputData.UserName);
    if (ans) {
      return;
    }

    const newUser = {
      Username: inputData.UserName,
      password: inputData.PasswordHash,
      RoleName: inputData.RoleName,
      email: inputData.Email,
      CreateAt: new Date().toISOString(),
      isAdmin: inputData.IsAdmin,
      address: inputData.HomeAddress,
      dob: inputData.DateOfBirth,
      phone: inputData.PhoneNumber,
      firstName: inputData.FirstName,
      lastName: inputData.LastName,
      SecurityQuestion: inputData.SecurityQuestion,
      SecurityAnswer: inputData.SecurityAnswer,
    };

    try {
      // REVERT to no supabase authentication, do not change
      const userResponse = await CreateUser(newUser);
      if (userResponse === true) {
        const userID = await getUserIdByUsername(inputData.UserName);
        console.log("username", inputData.UserName);
        console.log("GetUserIdByUserName", userID);
        if (!userID) {
          console.error("UserID not found for the created user");
          return;
        }
        if (inputData.RoleName === "Student") {
          const studentResponse = await createStudentByUserId(userID);
          handleOpenModal();
          if (studentResponse) {
            console.log("Student created successfully");
          } else {
            console.error("Error creating student");
          }
        } else if (inputData.RoleName === "Teacher") {
          const studentResponse = await createTeacherByUserId(userID);
          handleOpenModal();
          if (studentResponse) {
            console.log("Teacher created successfully");
          } else {
            console.error("Error creating teacher.");
          }
        } else {
          handleOpenModal();
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    navigate("/users/user-list");
  }

  return (
    <div className={styles.profileFormLayout}>
      <EditContainer title="Login Information">
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="UserName" className={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              name="UserName"
              className={styles.formInput}
              value={inputData.UserName}
              onChange={handleChange}
              disabled={isModalOpen}
            />
            {errors.UserName && (
              <p className={styles.error}>{errors.UserName}</p>
            )}
          </div>
          <div className={styles.formItem}>
            <label htmlFor="PasswordHash" className={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              name="PasswordHash"
              className={styles.formInput}
              value={inputData.PasswordHash}
              onChange={handleChange}
              disabled={isModalOpen}
            />
            {errors.PasswordHash && (
              <p className={styles.error}>{errors.PasswordHash}</p>
            )}
          </div>
          <div className={styles.formItem}>
            <label htmlFor="ConfirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <input
              type="password"
              name="ConfirmPassword"
              className={styles.formInput}
              value={inputData.ConfirmPassword}
              onChange={handleChange}
              disabled={isModalOpen}
            />
            {errors.ConfirmPassword && (
              <p className={styles.error}>{errors.ConfirmPassword}</p>
            )}
          </div>
        </div>
      </EditContainer>
      <EditContainer title="Profile Information">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="FirstName" className={styles.formLabel}>
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                className={styles.formInput}
                value={inputData.FirstName}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.FirstName && (
                <p className={styles.error}>{errors.FirstName}</p>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="LastName" className={styles.formLabel}>
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                className={styles.formInput}
                value={inputData.LastName}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.LastName && (
                <p className={styles.error}>{errors.LastName}</p>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="RoleName" className={styles.formLabel}>
                Role
              </label>
              <select
                name="RoleName"
                value={inputData.RoleName}
                className={styles.formInput}
                onChange={handleChange}
                disabled={isModalOpen}
              >
                <option>Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Advisor">Advisor</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              {errors.RoleName && (
                <p className={styles.error}>{errors.RoleName}</p>
              )}
            </div>

            <div className={styles.formItem}>
              <label htmlFor="DateOfBirth" className={styles.formLabel}>
                Date of Birth
              </label>
              <input
                type="date"
                name="DateOfBirth"
                className={styles.formInput}
                value={inputData.DateOfBirth}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.DateOfBirth && (
                <p className={styles.error}>{errors.DateOfBirth}</p>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="PhoneNumber" className={styles.formLabel}>
                Phone Number
              </label>
              <input
                type="text"
                name="PhoneNumber"
                className={styles.formInput}
                value={inputData.PhoneNumber}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.PhoneNumber && (
                <p className={styles.error}>{errors.PhoneNumber}</p>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="Email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                name="Email"
                className={styles.formInput}
                value={inputData.Email}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.Email && <p className={styles.error}>{errors.Email}</p>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="HomeAddress" className={styles.formLabel}>
                Home Address
              </label>
              <input
                type="text"
                name="HomeAddress"
                className={styles.formInput}
                value={inputData.HomeAddress}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.HomeAddress && (
                <p className={styles.error}>{errors.HomeAddress}</p>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="SecurityQuestion" className={styles.formLabel}>
                Security Question
              </label>
              <input
                type="text"
                name="SecurityQuestion"
                className={styles.formInput}
                value={inputData.SecurityQuestion}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.SecurityQuestion && (
                <p className={styles.error}>{errors.SecurityQuestion}</p>
              )}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="SecurityAnswer" className={styles.formLabel}>
                Security Answer
              </label>
              <input
                type="text"
                name="SecurityAnswer"
                className={styles.formInput}
                value={inputData.SecurityAnswer}
                onChange={handleChange}
                disabled={isModalOpen}
              />
              {errors.SecurityAnswer && (
                <p className={styles.error}>{errors.SecurityAnswer}</p>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <label htmlFor="IsAdmin" className={styles.formLabel}>
                ID Verified
              </label>
              <select
                name="IsAdmin"
                value={inputData.IsAdmin}
                className={styles.formInput}
                onChange={handleChange}
                disabled={isModalOpen}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>

          <div className={styles.buttonLayout}>
            <div className={styles.buttons}>
              <Button size="large" onClickBtn={handleSubmit}>
                Create
              </Button>
              <Button size="large" onClickBtn={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </EditContainer>

      <EditContainer title="Insert Data from Excel to Supabase">
        <div>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <Button onClickBtn={insertDataExcel}>Insert data</Button>
        </div>

        {isModalOpen && (
          <div className={styles.modal}>
            <ModalBox handleCloseModal={handleCloseModal} />
          </div>
        )}
      </EditContainer>
    </div>
  );
}

export default ProfileForm;
