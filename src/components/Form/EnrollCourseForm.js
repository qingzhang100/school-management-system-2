import React, { useState, useEffect } from "react";
import formStyles from "./Form.module.css";
import generalStyles from "../../generalStyles.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import Button from "../Button/Button";
import { getCourses } from "../../services/apiCourse";
import {
  getStudentByUserNo,
  getStudentEnrollments,
} from "../../services/apiStudent";
import {
  deleteEnrollment,
  insertEnrollment,
} from "../../services/apiEnrollment";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getStudentCoursesByUserID } from "../../services/apiStudent";
function EnrollCourseForm() {
  const { userNo } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch all courses
        const courseData = await getCourses();
        setCourses(courseData);

        // Fetch student data and their enrolled courses
        const student = await getStudentByUserNo(userNo);
        setStudentData(student);

        const enrolled = await getStudentEnrollments(userNo);
        setEnrolledCourseIds(enrolled.map((course) => course.CourseID)); // Store enrolled course IDs
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userNo]);

  async function handleEnroll(courseId) {
    try {
      await insertEnrollment(
        studentData.StudentID,
        courseId,
        new Date().toISOString(),
        false
      );
      alert("Student enrolled successfully!");
      setEnrolledCourseIds((prev) => [...prev, courseId]); // Update the enrolled courses
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert("An error occurred while enrolling the student.");
    }
  }

  async function handleRemove(courseId) {
    const isConfirmed = window.confirm("Do you want to remove this course?");
    if (!isConfirmed) return;

    try {
      await deleteEnrollment(studentData.StudentID, courseId);
      setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
    } catch (error) {
      console.error("Error removing course from student:", error);
    }
  }

  return (
    <>
      <MainTitle
        title={
          isLoading || !studentData
            ? `Enroll courses`
            : `Enroll courses for: ${studentData?.Users?.FirstName} ${studentData?.Users?.LastName}`
        }
        goBack={true}
      />
      <EditContainer>
        <div className={formStyles.formContainer}>
          {error && <div className={formStyles.error}>{error}</div>}
          <table className={formStyles.courseTable}>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.CourseID}>
                  <td>{course.CourseName}</td>
                  <td>{new Date(course.StartDate).toLocaleDateString()}</td>
                  <td>{new Date(course.EndDate).toLocaleDateString()}</td>
                  <td>
                    {isLoading ? (
                      <span>Loading...</span>
                    ) : enrolledCourseIds.includes(course.CourseID) ? (
                      <span className={formStyles.enrolledText}>
                        Enrolled (
                        <Link
                          className={generalStyles.noStyleLink}
                          style={{ color: "red" }}
                          onClick={() => handleRemove(course.CourseID)}
                        >
                          remove
                        </Link>
                        )
                      </span>
                    ) : (
                      <Button
                        onClickBtn={() => handleEnroll(course.CourseID)}
                        size="small"
                      >
                        Enroll
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditContainer>
    </>
  );
}

export default EnrollCourseForm;
