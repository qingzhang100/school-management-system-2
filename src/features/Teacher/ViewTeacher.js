import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../Profile.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import PersonalInfoForm from "../../components/Form/PersonalInfoForm";
import MainTitle from "../../ui/MainTitle/MainTitle";
import formStyles from "../../components/Form/Form.module.css";
import { getTeacherCourses } from "../../services/apiTeacher";
import Button from "../../components/Button/Button";
import { removeCourseFromTeacher } from "../../services/apiTeacher";

function TeacherDetail() {
  const { userNo } = useParams();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getTeacherCourses(userNo);
        setCourses(data);
      } catch (error) {
        setError("Failed to fetch courses.");
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [userNo]);

  function handleAddCourse() {
    navigate(`/teachers/${userNo}/add-course`); // Navigate to the enroll course form
  }

  function handleRemoveCourse(courseID) {
    async function removeCourse() {
      try {
        const response = await removeCourseFromTeacher({
          CourseID: courseID,
          TeacherID: userNo,
        });

        if (response.success) {
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.CourseID !== courseID)
          );
        }
      } catch (error) {
        setError("Failed to remove course.");
        console.error("Error removing course:", error);
      }
    }

    removeCourse();
  }

  return (
    <>
      <MainTitle title="Teacher Detail" goBack={true} />
      {/* <div className={styles.profileLayout}> */}
      <div className={styles.mainColumn}>
        <PersonalInfoForm userNo={userNo} hideUpload={true} />
        {/* <EditContainer title="Additional Information"></EditContainer> */}
        <EditContainer
          title="Courses"
          editButtonText="Manage Assigned Courses"
          onClickEdit={handleAddCourse}
        >
          <div className={formStyles.formContainer}>
            <table className={formStyles.courseTable}>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.CourseID}>
                    <td>{course.CourseName}</td>
                    <td>{new Date(course.StartDate).toLocaleDateString()}</td>
                    <td>{new Date(course.EndDate).toLocaleDateString()}</td>
                    <td>{course.Time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EditContainer>
        {/* </div> */}
        {/* <div className={styles.secondaryColumn}>
          <EditContainer title="Some charts here">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </EditContainer>{" "}
          <EditContainer title="Remarks">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </EditContainer>{" "}
          <EditContainer title="Communication">
            123 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          </EditContainer>{" "}
          <EditContainer title="Communication">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </EditContainer>
        </div> */}
      </div>
    </>
  );
}

export default TeacherDetail;
