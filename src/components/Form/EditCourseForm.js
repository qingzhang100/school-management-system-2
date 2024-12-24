import React, { useState } from "react";
import styles from "./Form.module.css";
import Button from "../Button/Button";

function EditCourseForm({ course, onSubmit, onCancel, teachers }) {
  const [courseName, setCourseName] = useState(course.CourseName);
  const [description, setDescription] = useState(course.Description);
  const [teacherID, setTeacherID] = useState(course.TeacherID);
  const [startDate, setStartDate] = useState(course.StartDate || ""); // Optional Start Date
  const [endDate, setEndDate] = useState(course.EndDate || "");       // Optional End Date
  const [time, setTime] = useState(course.Time || "");       // Optional End Date

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Data being submitted:", {
      CourseName: courseName,
      Description: description,
      TeacherID: teacherID,
      StartDate: startDate || null,
      EndDate: endDate || null,
      Time: time,
    });
    onSubmit({
      CourseName: courseName,
      Description: description,
      TeacherID: teacherID,
      StartDate: startDate || null, // Ensure empty string is treated as null
      EndDate: endDate || null,
      Time: time
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div>
        <label>Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div>
        <label>Time:</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          
        />
      </div>
      <div>
        <label>Program Name:</label>
        <input type="text" value={course.Programs.ProgramName} readOnly />
      </div>
      <div>
        <label>Teacher:</label>
        {teachers && teachers.length > 0 ? (
          <select
            value={teacherID}
            onChange={(e) => setTeacherID(e.target.value)}
            required
          >
            {teachers.map((teacher) => (
              <option key={teacher.TeacherID} value={teacher.TeacherID}>
                {teacher.Users.FirstName} {teacher.Users.LastName}
              </option>
            ))}
          </select>
        ) : (
          <p>No teachers found or loading...</p>
        )}
      </div>

      <Button type="submit">Update Course</Button>
      <Button type="button" onClickBtn={onCancel}>
        Cancel
      </Button>
    </form>
  );
}

export default EditCourseForm;
