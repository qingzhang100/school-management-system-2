import React from "react";
import { json, useNavigate } from "react-router-dom";
import styles from "../../components/Table.module.css";
import useCheckbox from "../../hooks/useCheckbox";

function TestGradeTable({ testGradeData, userRole }) {
  const {
    isAllSelected,
    handleSelectAll,
    selectedCheckboxes,
    handleCheckboxes,
  } = useCheckbox();
  const navigate = useNavigate();

  const currData = testGradeData; // Assuming pagination is not required
//console.log('currData ' + JSON.stringify(currData));
  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() =>
                  handleSelectAll(currData.map((element) => element.StudentID))
                }
                className={styles.checkbox}
              />
            </th>
            <th>Course Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Quiz 1</th>
            <th>Quiz 2</th>
            <th>Quiz 3</th>
            <th>Quiz 4</th>
            <th>Quiz 5</th>
            <th>Midterm</th>
            <th>Final</th>
            <th>Average Grade</th>
            <th>Passed</th>
            {userRole === "Teacher" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currData.map((grade, index) => (
            <tr key={index} className={styles.tr}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.includes(grade.StudentID)}
                  onChange={() => handleCheckboxes(grade.StudentID)}
                  className={styles.checkbox}
                />
              </td>
              <td>{grade.Courses.CourseName}</td>
              <td>{grade.Students.Users.FirstName}</td>
              <td>{grade.Students.Users.LastName}</td>
              <td>{grade.Quizz1}</td>
              <td>{grade.Quizz2}</td>
              <td>{grade.Quizz3}</td>
              <td>{grade.Quizz4}</td>
              <td>{grade.Quizz5}</td>
              <td>{grade.Midterm}</td>
              <td>{grade.Final}</td>
              <td>{grade.AverageGrade}</td>
              <td>{grade.isPassed ? "Yes" : "No"}</td>
              {userRole === "Teacher" && (
                <td>
                  <button className="Button_btn__58t-o Button_small__c9FMV Button_rose__LaWgJ" onClick={() => navigate(`/my-grades/${grade.TestGradeNo}`)}> Update </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestGradeTable;
