// prev code

// import React from "react";
// import formStyles from "./Form.module.css";
// import EditContainer from "../../ui/Layout/EditContainer";
// import Button from "../Button/Button";

// function StudentDetailForm({ studentData, onCancel }) {
//   return (
//     <EditContainer>
//       <div className={formStyles.formContainer}>
//         <h1 className={formStyles.formTitle}>Student Details</h1>
//         <div className={formStyles.formItem}>
//           <label className={formStyles.formLabel}><strong>Name:</strong></label>
//           <p className={formStyles.formValue}>{studentData.Users.FirstName} {studentData.Users.LastName}</p>
//         </div>
//         <div className={formStyles.formItem}>
//           <label className={formStyles.formLabel}><strong>Email:</strong></label>
//           <p className={formStyles.formValue}>{studentData.Users.Email}</p>
//         </div>
//         <div className={formStyles.formItem}>
//           <label className={formStyles.formLabel}><strong>Home Address:</strong></label>
//           <p className={formStyles.formValue}>{studentData.Users.HomeAddress}</p>
//         </div>
//         <div className={formStyles.formItem}>
//           <label className={formStyles.formLabel}><strong>Date of Birth:</strong></label>
//           <p className={formStyles.formValue}>{studentData.Users.DateOfBirth}</p>
//         </div>
//         <div className={formStyles.formItem}>
//           <label className={formStyles.formLabel}><strong>Phone Number:</strong></label>
//           <p className={formStyles.formValue}>{studentData.Users.PhoneNumber}</p>
//         </div>
//         <div className={formStyles.buttonContainer}>
//           <Button onClickBtn={onCancel} size="large">
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </EditContainer>
//   );
// }

// export default StudentDetailForm;

import React, { useState, useEffect } from "react";
import formStyles from "./Form.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import {
  updateStudent,
  getStudentEnrollments,
} from "../../services/apiStudent";
import avatar from "../../assets/user-avatar-account.jpg";
import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

function StudentDetailForm({ studentData, data, showEditButton }) {
  const [inputData, setInputData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    HomeAddress: "",
    DateOfBirth: "",
    PhoneNumber: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const { userNo } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentData && studentData.Users) {
      setInputData({
        FirstName: studentData.Users.FirstName || "",
        LastName: studentData.Users.LastName || "",
        Email: studentData.Users.Email || "",
        HomeAddress: studentData.Users.HomeAddress || "",
        DateOfBirth: studentData.Users.DateOfBirth || "",
        PhoneNumber: studentData.Users.PhoneNumber || "",
      });
    }
  }, [studentData]);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const enrollmentData = await getStudentEnrollments(userNo);
        setEnrollments(enrollmentData);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        setError("Failed to fetch enrollments.");
      }
    }

    fetchEnrollments();
  }, [userNo]);

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

  function handleClickCancel() {
    setIsEdit((prev) => !prev);
    setError(null);
  }

  async function handleClickSave() {
    try {
      const response = await updateStudent(studentData.Users.UserNo, inputData);
      setIsEdit(false);
      // if (response) {
      //   alert("User information updated successfully!");

      //   console.log("User updated successfully!", response);
      // } else {
      //   alert("Failed to update user information.");
      //   console.error("Failed to update user information.");
      // }
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("An error occurred while saving the user data.");
    }
  }

  function handleAddCourse() {
    navigate(`/students/${userNo}/enroll`); // Navigate to the enroll course form
  }

  return (
    <>
      <EditContainer
        title="Personal Information"
        editButtonText="Edit"
        isEdit={isEdit}
        onClickEdit={handleClickEdit}
        onClickSave={handleClickSave}
        onClickCancel={handleClickCancel}
        showEditButton={showEditButton}
      >
        {console.log("prprpr", data)}
        <div className={formStyles.sectionLayout}>
          <div className={formStyles.avatar}>
            <img src={avatar} alt="user avatar" />
            {/* <Button>Upload Picture</Button> */}
          </div>
          <form>
            <div className={formStyles.formRow}>
              {" "}
              <div className={formStyles.formItem}>
                <label htmlFor="role" className={formStyles.formLabel}>
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className={formStyles.formInput}
                  readOnly
                  disabled
                  value={inputData.RoleName}
                />
              </div>
            </div>
            <div className={formStyles.formRow}>
              <div className={formStyles.formItem}>
                <label htmlFor="firstName" className={formStyles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="FirstName"
                  className={formStyles.formInput}
                  disabled={!isEdit}
                  value={inputData.FirstName}
                  onChange={handleChange}
                />
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
                  disabled={!isEdit}
                  value={inputData.LastName}
                  onChange={handleChange}
                />
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
            </div>
          </form>
        </div>
      </EditContainer>
      <br />
    </>
  );
}

export default StudentDetailForm;
