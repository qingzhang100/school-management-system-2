import React, { useState, useEffect } from "react";
import TableContainer from "../../ui/Layout/TableContainer";
import CourseTable from "./CourseTable";
import { getCourse, getCourses } from "../../services/apiCourse";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { useNavigate } from "react-router-dom";
import { searchCourses } from "../../services/apiCourse";
import { sortCoursesBy } from "../../services/apiCourse";
function CourseList() {
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(courseData.length / rowsPerPage);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await getCourses();
        setCourseData(data);
      } catch (error) {
        setError("Failed to fetch courses.");
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  function handleAddBtn() {
    navigate("/courses/new-course");
  }

  async function handleSearch(query) {
    try {
      const results = await searchCourses(query);
      console.log("Search Results:", results);
      setCourseData(results);
    } catch (error) {
      console.error("Error searching courses:", error);
    }
  }

  async function handleSort(fieldName) {
    try {
      const sortedData = await sortCoursesBy(fieldName);
      setCourseData(sortedData);
    } catch (error) {
      console.error("Error sorting user table:", error);
    }
  }

  return (
    <>
      <MainTitle title="Course List" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onClickAddBtn={handleAddBtn}
        onSearch={handleSearch}
        sortOptions={["Course No", "Course Name"]}
        onClickSort={handleSort}
      >
        <CourseTable
          data={courseData}
          rowsPerPage={rowsPerPage}
          currPage={currPage}
          isLoading={isLoading}
        />
      </TableContainer>
    </>
  );
}

export default CourseList;
