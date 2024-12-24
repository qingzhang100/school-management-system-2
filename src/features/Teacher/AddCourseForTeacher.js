import React, { useState, useEffect } from "react";
import formStyles from "../../components/Form/Form.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import Button from "../../components/Button/Button";
import { getCourseDetail, getCourses } from "../../services/apiCourse";
import {
  assignCourseToTeacher as assignCourseToTeacher,
  getTeacherIdByCourseId,
  removeCourseAssignment,
  getTeacherIdByUserNo,
  removeCourseFromTeacher,
} from "../../services/apiTeacher";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getFullNameByNo } from "../../services/apiUser";
import { getTeacherByNo } from "../../services/apiTeacher";

function AddCourseForTeacher() {
  const { userNo } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [teacherId, setTeacherId] = useState("");
  const [courseTeacherId, setCourseTeacherId] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const courseData = await getCourses();
        setCourses(courseData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError("Failed to fetch courses.");
      }
    }

    fetchCourses();
  }, []);

  // Important: Data structure of a course
  // {
  //   "CourseID": 1,
  //   "CourseName": "Math 101",
  //   "Teachers": {
  //     "TeacherID": 123,
  //     "Users": {
  //       "UserNo": 31123
  //       "FirstName": "John",
  //       "LastName": "Doe"
  //     }
  //   }
  // }

  useEffect(() => {
    async function getFullName() {
      const name = await getFullNameByNo(userNo);
      setFullName(name);
    }
    getFullName();
  }, [userNo]);

  useEffect(() => {
    async function fetchTeacherID() {
      const teacherid = await getTeacherIdByUserNo(userNo);
      setTeacherId(teacherid);
    }
    fetchTeacherID();
  }, [userNo]);

  const handleAssignCourse = async (course) => {
    try {
      const response = await assignCourseToTeacher(course.CourseID, teacherId);

      if (response.success) {
        alert("Course added successfully!");

        // Make the button switch to "assigned" after assigning
        setCourses((prevCourses) =>
          prevCourses.map((c) =>
            c.CourseID === course.CourseID
              ? {
                  ...c,
                  Teachers: {
                    TeacherID: teacherId,
                    Users: {
                      ...c.Teachers?.Users, // Use optional chaining to avoid error when Teachers is undefined
                      UserNo: userNo,
                    },
                  },
                }
              : c
          )
        );
      } else {
        alert("Failed to add course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("An error occurred while adding the course.");
    }
  };

  async function handleRemoveAssignment(course) {
    const isConfirmed = window.confirm("Do you want to remove this course?");
    if (!isConfirmed) return;
    try {
      const response = await removeCourseFromTeacher(course);
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.CourseID === course.CourseID
            ? { ...c, Teachers: null } // Remove the teacher assignment
            : c
        )
      );
    } catch (error) {
      console.error("Error removing course from teacher:", error);
    }
  }

  return (
    <>
      <MainTitle title={`Assign Courses: ${fullName}`} goBack={true} />
      <EditContainer>
        <div className={formStyles.formContainer}>
          {error && <div className={formStyles.error}>{error}</div>}
          <table className={formStyles.courseTable}>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time</th>
                <th>Current Teacher</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.CourseID}>
                  <td>{course.CourseName}</td>
                  <td>{new Date(course.StartDate).toLocaleDateString()}</td>
                  <td>{new Date(course.EndDate).toLocaleDateString()}</td>
                  <td>{course.Time}</td>
                  <td>
                    {course.Teachers
                      ? `${course.Teachers.Users.FirstName} ${course.Teachers.Users.LastName}`
                      : "No teacher assigned"}
                  </td>

                  <td>
                    {course.Teachers &&
                    course.Teachers.Users.UserNo == userNo ? (
                      <span>
                        Assigned (
                        <Link
                          onClick={() => handleRemoveAssignment(course)}
                          style={{ color: "red" }}
                        >
                          Remove
                        </Link>
                        )
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="small"
                        color="blue"
                        onClickBtn={() => handleAssignCourse(course)}
                      >
                        Assign
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

export default AddCourseForTeacher;
