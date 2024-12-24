import React from "react";
import styles from "../../components/Table.module.css";
import { Link } from "react-router-dom";
import Loader from "../../ui/Loader";
import { useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox";
import Button from "../../components/Button/Button";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function StudentTable({ studentData, rowsPerPage, currPage, isLoading }) {
  const {
    selectedCheckboxes,
    handleCheckboxes,
    isAllSelected,
    handleSelectAll,
  } = useCheckbox();

  const currData = studentData.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );
  const navigate = useNavigate();

  if (!studentData) {
    return <p>No students available Or Student not found!</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {/* <th>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() =>
                handleSelectAll(currData.map((element) => element.Users.UserNo))
              }
              className={styles.checkbox}
            />
          </th> */}
          <th>S/N</th>
          <th>User No.</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of Birth</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <Loader />
        ) : (
          currData.map((student, index) => (
            <tr key={student.Users.UserNo} className={styles.tr}>
              {/* <td>
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.includes(student.Users.UserNo)}
                  onChange={() => handleCheckboxes(student.Users.UserNo)}
                  className={styles.checkbox}
                />
              </td> */}

              <td>{index + 1 + (currPage - 1) * rowsPerPage}</td>
              <td>{student.Users.UserNo}</td>
              <td>{student.Users.FirstName}</td>
              <td>{student.Users.LastName}</td>
              <td>{formatDate(student.Users.DateOfBirth)}</td>
              <td>{student.Users.Email}</td>
              <td>{student.Users.PhoneNumber}</td>
              <td>{student.Users.HomeAddress}</td>
              <td>
                <div className={styles.rowButtons}>
                  <Button
                    onClickBtn={() =>
                      navigate(`/students/${student.Users.UserNo}`)
                    }
                    size="small"
                    color="rose"
                  >
                    View/Edit
                  </Button>
                  <Button
                    onClickBtn={() =>
                      navigate(`/students/${student.Users.UserNo}/enroll`)
                    }
                    size="small"
                    color="blue"
                  >
                    Enroll
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default StudentTable;
