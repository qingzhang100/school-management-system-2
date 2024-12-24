import generalStyles from "../../generalStyles.module.css";
import styles from "../Profile.module.css";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loader from "../../ui/Loader";
import EditContainer from "../../ui/Layout/EditContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";
import {
  getCourseDetail,
  deleteCourse,
  updateCourse,
} from "../../services/apiCourse";
import Button from "../../components/Button/Button";
import { getTeachers } from "../../services/apiTeacher";
import formStyles from "../../components/Form/Form.module.css";

function CourseDetail() {
  const { courseNo } = useParams();
  const navigate = useNavigate();
  const [originalCourse, setOriginalCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const teacherData = await getTeachers();
        setTeachers(teacherData);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      }
    }
    fetchData();
  }, []);
  // useEffect(() => {
  //   async function fetchEnrollmentData() {
  //     try {
  //       const enrollmentData = await getEnrolledStudents(courseNo);
  //       setEnrollments(enrollmentData);
  //     } catch (error) {
  //       console.error("Failed to fetch enrollments:", error);
  //     }
  //   }

  //   fetchEnrollmentData();
  // }, [courseNo]);
  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseDetail({ params: { ID: courseNo } });
        console.log("Fetched course data:", courseData);
        setCourse(courseData);
        setOriginalCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseDetails();
  }, [courseNo]);

  const handleDeleteCourse = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    try {
      await deleteCourse(course.CourseID);
      alert("Course deleted successfully!");
      navigate("/courses/course-list");
    } catch (err) {
      alert("Failed to delete the course: " + err.message);
    }
  };

  const handleBack = () => {
    navigate("/courses/course-list");
  };

  const handleCancelEdit = () => {
    setCourse(originalCourse);
    setCourse(originalCourse);
    setIsEditing(false);
  };

  const handleClickSave = async () => {
    try {
      const { Programs, TeacherUser, Teachers, ...cleanedCourse } = course;

      console.log("Cleaned course data:", cleanedCourse);
      console.log("Updating course with courseNo:", courseNo);

      const res = await updateCourse(courseNo, cleanedCourse);
      console.log("res = ", res);
      setIsEditing(false);

      if (res) {
        alert("Course information updated successfully!");
        const courseData = await getCourseDetail({ params: { ID: courseNo } });
        setCourse(courseData); // Refresh course data
      } else {
        alert("Failed to update course information.");
      }
    } catch (error) {
      console.error("Error saving course data:", error);
      alert("An error occurred while saving the course data.");
    }
  };

  const handleEditBtn = (e) => {
    e.preventDefault();
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <MainTitle
        title={
          isLoading ? `Course Detail` : `Course Detail: ${course?.CourseName}`
        }
        goBack={true}
      />
      <div className={styles.mainColumn}>
        {course ? (
          <EditContainer
            title={course?.CourseName}
            editButtonText="Edit"
            isEdit={isEditing}
            onClickEdit={handleEditBtn}
            onClickSave={handleClickSave}
            onClickCancel={handleCancelEdit}
            onClickDelete={handleDeleteCourse}
          >
            <div className={formStyles.sectionLayout}>
              <form>
                <div className={formStyles.formRow}>
                  <div className={formStyles.formItem}>
                    <label htmlFor="courseID" className={formStyles.formLabel}>
                      Course ID
                    </label>
                    <input
                      type="text"
                      id="courseID"
                      name="CourseID"
                      className={formStyles.formInput}
                      readOnly
                      disabled
                      value={course.CourseID}
                    />
                  </div>
                </div>

                <div className={formStyles.formRow}>
                  <div className={formStyles.formItem}>
                    <label
                      htmlFor="courseName"
                      className={formStyles.formLabel}
                    >
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="courseName"
                      name="CourseName"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={course.CourseName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={formStyles.formItem}>
                    <label
                      htmlFor="description"
                      className={formStyles.formLabel}
                    >
                      Course Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="Description"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={course.Description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={formStyles.formRow}>
                  <div className={formStyles.formItem}>
                    <label htmlFor="startDate" className={formStyles.formLabel}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="StartDate"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={course.StartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={formStyles.formItem}>
                    <label htmlFor="endDate" className={formStyles.formLabel}>
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="EndDate"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={course.EndDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={formStyles.formItem}>
                    <label htmlFor="time" className={formStyles.formLabel}>
                      Time
                    </label>
                    <input
                      type="text"
                      id="time"
                      name="Time"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={course.Time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={formStyles.formRow}>
                  <div className={formStyles.formItem}>
                    <label
                      htmlFor="teacherName"
                      className={formStyles.formLabel}
                    >
                      Teacher Name
                    </label>
                    {isEditing ? (
                      teachers && teachers.length > 0 ? (
                        <select
                          value={course.TeacherID}
                          name="TeacherID"
                          onChange={handleChange}
                          required
                          className={formStyles.formInput}
                        >
                          {teachers.map((teacher) => (
                            <option
                              key={teacher.TeacherID}
                              value={teacher.TeacherID}
                            >
                              {teacher.Users.FirstName} {teacher.Users.LastName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p>No teachers found or loading...</p>
                      )
                    ) : (
                      <input
                        type="text"
                        id="teacherName"
                        name="TeacherName"
                        className={formStyles.formInput}
                        disabled={!isEditing}
                        value={`${course.TeacherUser.FirstName} ${course.TeacherUser.LastName}`}
                      />
                    )}
                  </div>
                </div>

                <div className={formStyles.formRow}>
                  <div className={formStyles.formItem}>
                    <label
                      htmlFor="programName"
                      className={formStyles.formLabel}
                    >
                      Course Category
                    </label>
                    <input
                      type="text"
                      id="programName"
                      name="ProgramName"
                      className={formStyles.formInput}
                      disabled
                      value={course.Programs.ProgramName}
                    />
                  </div>
                  <div className={formStyles.formItem}>
                    <label
                      htmlFor="programCode"
                      className={formStyles.formLabel}
                    >
                      Course Category Code
                    </label>
                    <input
                      type="text"
                      id="programCode"
                      name="ProgramCode"
                      className={formStyles.formInput}
                      disabled
                      value={course.Programs.ProgramCode}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* <div className={formStyles.buttons}>
              {!isEditing ? (
                <Button onClickBtn={handleEditBtn}>Edit Course</Button>
              ) : (
                <>
                  <Button onClickBtn={handleClickSave}>Save</Button>
                  <Button onClickBtn={handleCancelEdit}>Cancel</Button>
                </>
              )}
              <Button onClickBtn={handleDeleteCourse} color="blue">
                Delete Course
              </Button>
            </div> */}
          </EditContainer>
        ) : (
          <div>No course data found.</div>
        )}

        {/* <EditContainer title="Enrolled Students">
          <div className={formStyles.formContainer}>
            <table className={formStyles.courseTable}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.StudentID}>
                      <td>{enrollment.StudentName}</td>
                      <td>{enrollment.Email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No students enrolled in this course.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </EditContainer> */}
      </div>
    </div>
  );
}

export default CourseDetail;
