import React, { useState } from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "../../components/Table.module.css";
//import styles from "../../components/Search/Search.module.css"

import { Link, useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox";
import Button from "../../components/Button/Button";

function CourseTable({ data, rowsPerPage, currPage }) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isAllSelected,
    handleSelectAll,
    selectedCheckboxes,
    handleCheckboxes,
  } = useCheckbox();

  const navigate = useNavigate();

  // const filteredData = data
  //   .filter((course) =>
  //     course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     const nameA = a.CourseName.toLowerCase();
  //     const nameB = b.CourseName.toLowerCase();

  //     if (sortOrder === "asc") {
  //       return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  //     } else {
  //       return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
  //     }
  //   });

  const currData = data.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  return (
    <div>
      <div>
        {/* <div >
        <input
          type="text"
          placeholder="Search by course name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button
          onClick={() =>
            setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"))
          }
          
        >
          Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
        </div> */}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() =>
                  handleSelectAll(currData.map((element) => element.CourseID))
                }
                className={styles.checkbox}
              />
            </th>
            <th>S/N</th>
            <th>Course No.</th>
            <th>Course Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currData.map((course, index) => (
            <tr key={course.CourseID} className={styles.tr}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.includes(course.CourseID)}
                  onChange={() => handleCheckboxes(course.CourseID)}
                  className={styles.checkbox}
                />
              </td>
              <td>{index + 1 + (currPage - 1) * rowsPerPage}</td>
              <td>{course.CourseNo}</td>
              <td>{course.CourseName}</td>
              <td>{course.StartDate}</td>
              <td>{course.EndDate}</td>
              <td>{course.Time}</td>
              <td>{course.Description}</td>
              <td>
                <div className={styles.rowButtons}>
                  <Button
                    onClickBtn={() => navigate(`/courses/${course.CourseNo}`)}
                    className={generalStyles.link}
                    size="small"
                    color="rose"
                  >
                    View/Edit
                  </Button>

                  <Button
                    onClickBtn={() =>
                      navigate(`/courses/newEnrollment/${course.CourseNo}`)
                    }
                    size="small"
                    color="blue"
                  >
                    Enroll
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseTable;
