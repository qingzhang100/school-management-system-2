import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../Profile.module.css";
import tableStyles from "../../components/Table.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import PersonalInfoForm from "../../components/Form/PersonalInfoForm";
import SecurityInfoForm from "../../components/Form/SecurityInfoForm";
import AccountInfoForm from "../../components/Form/AccountInfoForm";
import { getRoleNameByNo, getUserRoleByUserNo } from "../../services/apiUser";
import { getProfileInfoByNo } from "../../services/apiUser";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getTeacherCourses } from "../../services/apiTeacher";
import { getStudentEnrollments } from "../../services/apiStudent";
import Loader from "../../ui/Loader";

function ViewUser() {
  const { userNo } = useParams();
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getProfileInfoByNo(userNo);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userNo]);

  useEffect(() => {
    // Fetch courses based on role
    async function fetchUserCourses() {
      try {
        const role = await getUserRoleByUserNo(userNo);
        setUserRole(role);
        console.log("userRole", role);
        let courses = [];

        if (role === "Teacher") {
          courses = await getTeacherCourses(userNo);
        } else if (role === "Student") {
          courses = await getStudentEnrollments(userNo);
        }

        setUserCourses(courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError("Failed to load courses.");
      }
    }

    fetchUserCourses();
  }, [userNo]);

  // function getRandomColor() {
  //   const colors = ["gray", "green", "blue", "purple", "yellow"];
  //   const randomIndex = Math.floor(Math.random() * colors.length);
  //   return colors[randomIndex];
  // }

  function handleManageCourses() {
    if (userRole) {
      const path =
        userRole === "Teacher" ? `/teachers/${userNo}` : `/students/${userNo}`;
      navigate(path);
    }
  }

  return (
    <>
      <MainTitle
        title={
          isLoading
            ? `User Detail`
            : `User Detail: ${profileData?.FirstName} ${profileData?.LastName}`
        }
        goBack={true}
      />
      <div className={styles.profileLayout}>
        <div className={styles.mainColumn}>
          <PersonalInfoForm userNo={userNo} showDeleteButton={true} />
          {(profileData?.Roles?.RoleName === "Teacher" ||
            profileData?.Roles?.RoleName === "Student") && (
            <EditContainer
              title="Course Information"
              editButtonText="Manage Courses"
              onClickEdit={handleManageCourses}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <div className={tableStyles.tagContainer}>
                  {userCourses.map((course) => (
                    <div
                      key={course.CourseName}
                      className={tableStyles.courseTag}
                    >
                      {course.CourseName}
                    </div>
                  ))}
                </div>
              )}
            </EditContainer>
          )}
          <EditContainer title="Customizable Box">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </EditContainer>{" "}
          <EditContainer title="Customizable Box">
            <div className={styles.detail}>
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </EditContainer>
        </div>
        <div className={styles.secondaryColumn}>
          <SecurityInfoForm userNo={userNo} />
          <AccountInfoForm userNo={userNo} />
          <EditContainer title="Customizable Box">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </EditContainer>{" "}
        </div>
      </div>
    </>
  );
}

export default ViewUser;
