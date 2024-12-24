import React, { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient.js";
import EditContainer from "../../ui/Layout/EditContainer.js";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnrollmentDetails,
  insertEnrollments,
  getEnrollments, 
} from "../../services/apiEnrollment";
import { getCourseDetail } from "../../services/apiCourse.js";
import Button from "../../components/Button/Button";
import styles from "../Profile.module.css";
import {
  getStudents,
  getStudentNameForCourse,
} from "../../services/apiStudent.js";
import Select from "react-select";
import formStyles from "../../components/Form/Form.module.css";
import MainTitle from "../../ui/MainTitle/MainTitle.js";

function EnrollmentForm() {
 
  const { courseNo } = useParams();
  
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [enrollmentDate, setEnrollmentDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Current date
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isFinished, setIsFinished] = useState(false); // New state for checkbox

  const { EnrollmentID } = useParams(); 

  useEffect(() => {
    async function fetchStudents() {
      try {
        const studentsData = await getStudents();
        const options = studentsData.map((student) => ({
          value: student.StudentID,
          label: `${student.Users.FirstName} ${student.Users.LastName}`,
        }));
        setStudents(options);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }

    async function fetchCourseDetails(courseNo) {
    
      try {
        setIsLoading(true);
        setError(null);
       
        const enrolledStudentsData = await getEnrollmentDetails({
          params: { id: EnrollmentID },
        });
       
        const courseData = await getCourseDetail({ params: { ID: enrolledStudentsData.Courses.CourseNo } });   
        setCourse(courseData);        
        const recEnrolledStudentsData = enrolledStudentsData.Students;       
        const preselectedStudents = { value: recEnrolledStudentsData.StudentID, 
          label: `${recEnrolledStudentsData.Users.FirstName} 
          ${recEnrolledStudentsData.Users.LastName}`, 
        }; 
        
        setSelectedStudents(preselectedStudents);
        setEnrolledStudents(enrolledStudentsData);
        setIsFinished(enrolledStudentsData.isFinished);
        fetchEnrollments(enrolledStudentsData.Courses.CourseNo);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchEnrollments(courseNo) {
    
      try {
        
        setIsLoading(true);
        const courseDetails = await getCourseDetail({
          params: { ID: courseNo },
        });
        const courseID = courseDetails.CourseID;
     
         const enrollments = await getEnrollments();

         const filteredEnrollments = enrollments.filter(
           (enrollment) => enrollment.CourseID === courseID
         );

        const enrichedEnrollments = await Promise.all(
           filteredEnrollments.map(async (enrollment) => {
             const studentInfo = await getStudentNameForCourse(
               enrollment.StudentID
             );
             return {
               ...enrollment,
              studentName: `${studentInfo.Users.FirstName} ${studentInfo.Users.LastName}`, // Enrich with student name
             };
           })
         );

         setEnrolledStudents(enrichedEnrollments);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents();
    fetchCourseDetails(courseNo);
    fetchEnrollments(courseNo);
  }, [EnrollmentID]);

  const handleSave = async (event) => {
    event.preventDefault();
   
    if (!selectedStudents.length) {
      alert("Please select at least one student to enroll.");
      return;
    }
  
    // Filter out students who are already enrolled
    const newEnrollmentData = selectedStudents.filter(
      (student) =>
        !enrolledStudents.some((enrollment) => enrollment.StudentID === student.value)
    ).map((student) => ({
      CourseID: course.CourseID,
      EnrollmentDate: enrollmentDate,
      StudentID: student.value,
      isFinished: isFinished, // Add the isFinished value
    }));
  
    if (newEnrollmentData.length === 0) {
      alert("All selected students are already enrolled in this course.");
      return;
    }
  
    try {
      console.log("Enrollment data is:", newEnrollmentData);
      await insertEnrollments(newEnrollmentData);
  
      alert("Enrollment created successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to create enrollment: " + error.message);
    }
  };

  const handleStudentChange = (selectedOptions) => {
    setSelectedStudents(selectedOptions || []);
  };

  const handleUnenroll = async (studentID) => {
    try {
      setIsLoading(true);
      setError(null);

      await unenrollStudentFromCourse(studentID, course.CourseID);

      setEnrolledStudents((prevEnrollments) =>
        prevEnrollments.filter(
          (enrollment) => enrollment.StudentID !== studentID
        )
      );

      alert("Student unenrolled successfully!");
    } catch (error) {
      setError(error.message);
      console.error("Failed to unenroll student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unenrollStudentFromCourse = async (studentID, courseID) => {
    const { error } = await supabase
      .from("Enrollments")
      .delete()
      .eq("StudentID", studentID)
      .eq("CourseID", courseID);

    if (error) {
      throw new Error("Failed to unenroll student: " + error.message);
    }
  };

  const handleCheckboxChange = () => {
    setIsFinished(!isFinished);
  };

  return (
    <>
      <MainTitle
        title={`Enroll Students in ${course?.CourseName || ""}`}
        prevPath={"/courses/course-list"}
        goBack={true}
      />
      <div className={styles.mainColumn}>
        <EditContainer title="Select Students">
          <div className={styles.enrollmentForm}>
            <form>
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="courseName" className={formStyles.formLabel}>
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="CourseName"
                    value={course?.CourseName || ""}
                    disabled={true}
                    className={formStyles.formInput}
                  />
                </div>

                <div className={formStyles.formItem}>
                  <label htmlFor="Students" className={formStyles.formLabel}>
                    Select Students
                  </label>
                  <Select
                    options={students}
                    value={selectedStudents}
                    onChange={handleStudentChange}
                    isMulti
                    placeholder="Select students"
                  />
                </div>

                <div className={formStyles.formItem}>
                  <label htmlFor="isFinished" className={formStyles.formLabel}>
                    Is Finished
                  </label>
                  <input
                    type="checkbox"
                    id="isFinished"
                    name="isFinished"
                    checked={isFinished}
                    onChange={handleCheckboxChange}
                    className={formStyles.formInput}
                  />
                </div>
              </div>

              <div className={formStyles.bottomButtons}>
                <Button onClickBtn={handleSave} className={styles.saveButton}>
                  Enroll
                </Button>
              </div>
            </form>
          </div>
        </EditContainer>
        <EditContainer title="Enrolled Students">
          {" "}
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              {enrolledStudents.length > 0 ? (
                <table className={formStyles.courseTable}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((enrollment) => (
                      <tr key={enrollment.StudentID}>
                        <td>{enrollment.studentName}</td>
                        <td>
                          <Button
                            onClickBtn={() =>
                              handleUnenroll(enrollment.StudentID)
                            }
                            size="small"
                          >
                            Unenroll
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No students enrolled yet.</p>
              )}
            </div>
          </div>
        </EditContainer>
      </div>
    </>
  );
}

export default EnrollmentForm;