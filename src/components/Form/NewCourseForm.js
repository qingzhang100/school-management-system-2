import React, { useState, useEffect } from "react";
import Button from "../Button/Button.js";
import EditContainer from "../../ui/Layout/EditContainer.js";
import styles from "./Form.module.css";
import { getTeachers } from "../../services/apiTeacher.js"; // Import API calls
import { getProgramList } from "../../services/apiProgram.js"; // Import API calls
import { addCourse } from "../../services/apiCourse.js"; // Import addCourse function
import { useNavigate } from "react-router-dom";

function NewCourseForm({ type }) {
  const [inputData, setInputData] = useState({
    CourseName: "",
    Description: "",
    TeacherID: "",
    ProgramID: "",
    StartDate: "",
    EndDate: "",
    Time: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const teacherData = await getTeachers();
        const programData = await getProgramList();
        setTeachers(teacherData);
        setPrograms(programData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Course Data:", inputData); // Log the inputData to debug
    try {
      await addCourse(inputData);
      navigate("/courses/course-list");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <EditContainer>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="CourseName" className={styles.formLabel}>
              Course Name
            </label>
            <input
              type="text"
              name="CourseName"
              value={inputData.CourseName}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="Description" className={styles.formLabel}>
              Description
            </label>
            <textarea
              name="Description"
              value={inputData.Description}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="StartDate" className={styles.formLabel}>
              Start Date
            </label>
            <input
              type="date"
              name="StartDate"
              value={inputData.StartDate}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="EndDate" className={styles.formLabel}>
              End Date
            </label>
            <input
              type="date"
              name="EndDate"
              value={inputData.EndDate}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="Time" className={styles.formLabel}>
              Time
            </label>
            <input
              type="text"
              name="Time"
              value={inputData.Time}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="TeacherID" className={styles.formLabel}>
              Teacher
            </label>
            <select
              name="TeacherID"
              value={inputData.TeacherID}
              onChange={handleChange}
              className={styles.formInput}
              required
            >
              <option value="">Select a Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.TeacherID} value={teacher.TeacherID}>
                  {" "}
                  {teacher.Users.FirstName} {teacher.Users.LastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label htmlFor="ProgramID" className={styles.formLabel}>
              Course Category
            </label>
            <select
              name="ProgramID"
              value={inputData.ProgramID}
              onChange={handleChange}
              className={styles.formInput}
              required
            >
              <option value="">Select a Category</option>
              {programs.map((program) => (
                <option key={program.ProgramID} value={program.ProgramID}>
                  {" "}
                  {program.ProgramName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button size="large">Submit</Button>
          <Button
            size="large"
            onClickBtn={() => {
              console.log("Cancel button clicked");
              navigate("/courses/course-list");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </EditContainer>
  );
}

export default NewCourseForm;
