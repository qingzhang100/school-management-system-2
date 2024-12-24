import React, { useEffect } from "react";
import TableContainer from "../../ui/Layout/TableContainer";
import { useState } from "react";
import TeacherTable from "./TeacherTable";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getTeachers, sortTeachersBy } from "../../services/apiTeacher";
//import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

function TeacherList() {
  const [teacherData, setTeacherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(teacherData.length / rowsPerPage);

  useEffect(() => {
    try {
      async function fetchTeacherData() {
        setIsLoading(true);
        const data = await getTeachers();
        setTeacherData(data);
      }
      fetchTeacherData();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  async function handleSort(fieldName) {
    try {
      const sortedData = await sortTeachersBy(fieldName);
      setTeacherData(sortedData);
    } catch (error) {
      console.error("Error sorting user table:", error);
    }
  }

  function handleSearch(query) {
    setSearchQuery(query);
    if (query === "") {
      // If query is empty, reset the teacherData to initialTeachersData
      setTeacherData([]);
    } else {
      // Filter teacher data based on search query
      const filteredData = teacherData.filter((teacher) => {
        return (
          teacher.Users.FirstName.toLowerCase().includes(query.toLowerCase()) ||
          teacher.Users.Email.toLowerCase().includes(query.toLowerCase()) ||
          teacher.Users.PhoneNumber.toLowerCase().includes(
            query.toLowerCase()
          ) ||
          teacher.Users.LastName.toLowerCase().includes(query.toLowerCase())
        );
      });
      setTeacherData(filteredData);
    }
  }

  return (
    <>
      <MainTitle title="Teacher List" />
      {console.log("teacher data", teacherData)}
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearch={handleSearch}
      >
        <TeacherTable
          data={teacherData}
          rowsPerPage={rowsPerPage}
          currPage={currPage}
          isLoading={isLoading}
        />
      </TableContainer>
    </>
  );
}

export default TeacherList;
