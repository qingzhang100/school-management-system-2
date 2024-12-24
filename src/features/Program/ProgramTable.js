import React from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "../../components/Table.module.css";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../ui/Loader";
import useCheckbox from "../../hooks/useCheckbox";
import Button from "../../components/Button/Button";

function ProgramTable({ programData, rowsPerPage, currPage, isLoading }) {
  const currData = programData.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  const navigate = useNavigate();
  const {
    isAllSelected,
    handleSelectAll,
    selectedCheckboxes,
    handleCheckboxes,
  } = useCheckbox();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() =>
                handleSelectAll(currData.map((element) => element.ProgramNo))
              }
              className={styles.checkbox}
            />
          </th>
          <th>S/N</th>
          <th>Course Category Code</th>
          <th>Course Category Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {currData.map((program, index) => (
          <tr key={program.ProgramNo} className={styles.tr}>
            <td>
              <input
                type="checkbox"
                checked={selectedCheckboxes.includes(program.ProgramNo)}
                onChange={() => handleCheckboxes(program.ProgramNo)}
                className={styles.checkbox}
              />
            </td>
            <td>{index + 1 + (currPage - 1) * rowsPerPage}</td>
            <td>{program.ProgramCode}</td>
            <td>{program.ProgramName}</td>
            <td>
              <Button
                onClickBtn={() => navigate(`/programs/${program.ProgramCode}`)}
              >
                View/Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProgramTable;
