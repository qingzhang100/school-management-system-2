import React, { useState } from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "../../components/Table.module.css";
import { Link, useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox";
import Button from "../../components/Button/Button";
import { deleteUser } from "../../services/apiUser";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function UserTable({ data, setData, currPage, rowsPerPage }) {
  const {
    selectedCheckboxes,
    handleCheckboxes,
    isAllSelected,
    handleSelectAll,
  } = useCheckbox();

  const navigate = useNavigate();

  const currData = data.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  async function handleDelete(userNo) {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirmed) {
        const result = await deleteUser(userNo);
        setData((prev) => prev.filter((e) => e.UserNo !== userNo));
        if (result) {
          alert("User deleted successfully");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("There was an error deleting the user.");
    }
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {/* <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() =>
                handleSelectAll(currData.map((element) => element.UserNo))
              }
            /> */}
          </th>
          <th>S/N</th>
          <th>User No.</th>
          <th>Role</th>
          <th>User Name</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of Birth</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Address</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {currData.map((user, index) => (
          <tr key={user.UserNo} className={styles.tr}>
            <td>
              {/* <input
                type="checkbox"
                checked={selectedCheckboxes.includes(user.UserNo)}
                onChange={() => handleCheckboxes(user.UserNo)}
              /> */}
            </td>
            <td>{index + 1 + (currPage - 1) * rowsPerPage}</td>
            <td>{user.UserNo}</td>
            <td>
              <p className={`${styles.role} ${styles[user.Roles?.RoleName]}`}>
                {user.Roles?.RoleName}
              </p>
            </td>
            <td>{user.UserName}</td>
            <td>{user.FirstName}</td>
            <td>{user.LastName}</td>
            <td>{formatDate(user.DateOfBirth)}</td>
            <td>{user.Email}</td>
            <td>{user.PhoneNumber}</td>
            <td>{user.HomeAddress}</td>
            <td>{formatDate(user.CreatedAt)}</td>
            <td>
              <div className={styles.rowButtons}>
                <Button
                  onClickBtn={() => navigate(`/users/${user.UserNo}`)}
                  size="small"
                  color="rose"
                >
                  View/Edit
                </Button>{" "}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
