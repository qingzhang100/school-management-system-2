import React, { useState, useEffect } from "react";
import StudentTable from "./StudentTable";
import TableContainer from "../../ui/Layout/TableContainer";
import Loader from "../../ui/Loader";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { getStudents, searchStudents } from "../../services/apiStudent";
function StudentList() {
  const initialStudentData = useLoaderData() || [];
  const [studentData, setStudentData] = useState(initialStudentData);
  const [isLoading, setIsLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getStudents();
        setStudentData(data);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil(studentData.length / rowsPerPage);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  function handleSearch(query) {
    const filteredData = initialStudentData.filter((student) => {
      return (
        student.Users.FirstName.toLowerCase().includes(query.toLowerCase()) ||
        student.Users.LastName.toLowerCase().includes(query.toLowerCase()) ||
        student.Users.Email.toLowerCase().includes(query.toLowerCase()) ||
        student.Users.PhoneNumber.toLowerCase().includes(query.toLowerCase())
      );
    });
    setStudentData(filteredData);
  }

  return (
    <>
      <MainTitle title="Student List" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearch={handleSearch}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <StudentTable
            studentData={studentData}
            rowsPerPage={rowsPerPage}
            currPage={currPage}
          />
        )}
      </TableContainer>
    </>
  );
}

export default StudentList;
