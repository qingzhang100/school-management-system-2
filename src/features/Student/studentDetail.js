import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getStudentByUserNo } from "../../services/apiStudent";
import StudentDetailForm from "../../components/Form/StudentDetailForm";
import PersonalInfoForm from "../../components/Form/PersonalInfoForm";
import MainTitle from "../../ui/MainTitle/MainTitle";
import Loader from "../../ui/Loader";
import EditContainer from "../../ui/Layout/EditContainer";
import { getStudentEnrollments } from "../../services/apiStudent";
import formStyles from "../../components/Form/Form.module.css";
import { getStudentCoursesByUserID } from "../../services/apiStudent";

function StudentDetail() {
  const { userNo } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const student = await getStudentByUserNo(userNo);
        setStudentData(student);

        const enrolled = await getStudentCoursesByUserID(student.StudentID);
        setEnrolledCourses(enrolled.map((course) => course.CourseID));
      } catch (error) {
        setError("Failed to fetch student data or enrolled courses.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userNo]);

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

  function handleAddCourse() {
    navigate(`/students/${userNo}/enroll`); // Navigate to the enroll course form
  }

  return (
    <>
      <MainTitle
        title={
          isLoading
            ? `Student Detail`
            : `Student Detail: ${studentData?.Users?.FirstName} ${studentData?.Users?.LastName}`
        }
        goBack={true}
      />
      <div className={formStyles.profileFormLayout}>
        <PersonalInfoForm userNo={userNo} hideUpload={true} />
        <EditContainer
          title="Enrolled Courses"
          editButtonText="Manage Enrolled Courses"
          onClickEdit={handleAddCourse}
        >
          <div className={formStyles.formContainer}>
            <table className={formStyles.courseTable}>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Course Time</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.CourseID}>
                    <td>{enrollment.CourseName}</td>
                    <td>
                      {new Date(enrollment.StartDate).toLocaleDateString()}
                    </td>
                    <td>{new Date(enrollment.EndDate).toLocaleDateString()}</td>
                    <td>{enrollment.Time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EditContainer>
      </div>
    </>
  );
}

export default StudentDetail;
