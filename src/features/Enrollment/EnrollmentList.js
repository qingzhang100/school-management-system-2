import React, { useState, useEffect } from "react";
import EnrollmentTable from "./EnrollmentTable.js";
import TableContainer from "../../ui/Layout/TableContainer";
import { getEnrollments } from "../../services/apiEnrollment.js";
import { useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox"; // Assuming you have this hook for handling checkboxes
import MainTitle from "../../ui/MainTitle/MainTitle.js";

function EnrollmentList() {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const totalPages = Math.ceil(enrollmentData.length / rowsPerPage);

  const {
    isAllSelected,
    handleSelectAll,
    selectedCheckboxes,
    handleCheckboxes,
  } = useCheckbox();

  useEffect(() => {
    async function fetchEnrollmentData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEnrollments();
        setEnrollmentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnrollmentData();
  }, []);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1); // Reset to first page when rows per page changes
  }

  function handleAddBtn() {
    navigate("/enrollments/new-enrollment");
  }

  //send the selected Ids over
  function handleBulkEdit() {
    if (selectedCheckboxes.length > 0) {
      navigate("/enrollments/bulk-edit", {
        state: { selectedIds: selectedCheckboxes },
      });
    } else {
      alert("Please select at least one enrollment to edit.");
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <MainTitle title="Enrollment List" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onClickEditBtn={handleBulkEdit}
      >
        <EnrollmentTable
          enrollmentData={enrollmentData}
          rowsPerPage={rowsPerPage}
          currPage={currPage}
          isLoading={isLoading}
          isAllSelected={isAllSelected}
          handleSelectAll={handleSelectAll}
          selectedCheckboxes={selectedCheckboxes}
          handleCheckboxes={handleCheckboxes}
        />
      </TableContainer>
    </>
  );
}

export default EnrollmentList;
