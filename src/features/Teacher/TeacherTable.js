import React from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "../../components/Table.module.css";
import { Link, useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox";
import Button from "../../components/Button/Button";
import Loader from "../../ui/Loader";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function TeacherTable({ data, isLoading, rowsPerPage, currPage }) {
  const navigate = useNavigate();
  // const {
  //   selectedCheckboxes,
  //   handleCheckboxes,
  //   isAllSelected,
  //   handleSelectAll,
  // } = useCheckbox();

  if (isLoading === true) {
    return <Loader />;
  }

  if (!data || !Array.isArray(data)) {
    return <p>No teacher data</p>;
  }

  const currData = data?.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

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
        {currData.map((Teacher, index) => (
          <tr key={Teacher.Users.UserNo} className={styles.tr}>
            {/* <td>
              <input
                type="checkbox"
                checked={selectedCheckboxes.includes(Teacher.Users.UserNo)}
                onChange={() => handleCheckboxes(Teacher.Users.UserNo)}
              />
            </td> */}
            <td>{index + 1 + (currPage - 1) * rowsPerPage}</td>
            <td>{Teacher.Users.UserNo}</td>
            <td>{Teacher.Users.FirstName}</td>
            <td>{Teacher.Users.LastName}</td>
            <td>{formatDate(Teacher.Users.DateOfBirth)}</td>
            <td>{Teacher.Users.Email}</td>
            <td>{Teacher.Users.PhoneNumber}</td>
            <td>{Teacher.Users.HomeAddress}</td>
            <td>
              <div className={styles.rowButtons}>
                <Button
                  onClickBtn={() =>
                    navigate(`/teachers/${Teacher.Users.UserNo}`)
                  }
                  size="small"
                  color="rose"
                >
                  View/Edit
                </Button>
                <Button
                  onClickBtn={() =>
                    navigate(`/teachers/${Teacher.Users.UserNo}/add-course`)
                  }
                  size="small"
                  color="blue"
                >
                  Assign Courses
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TeacherTable;
