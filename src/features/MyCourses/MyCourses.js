import { useEffect, useState } from "react";
import styles from "./MyCourse.module.css";
import instructor1 from "../../assets/instructor.jpg";
import CourseCard from "../../components/CourseCard/CourseCard";
import TableContainer from "../../ui/Layout/TableContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getTeacherCoursesByUserID } from "../../services/apiTeacher";
import { getStudentCoursesByUserID } from "../../services/apiStudent";
import { getUserByID } from "../../services/apiUser";
import { getTeacherFullNameByCourseID } from "../../services/apiCourse";
import Loader from "../../ui/Loader";
function MyCourses() {
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsNums = [4, 8, 12, 16];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const userid = localStorage.getItem("UserID");

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        let courses = [];

        if (role === "Teacher") {
          courses = await getTeacherCoursesByUserID(userid);
        } else if (role === "Student") {
          courses = await getStudentCoursesByUserID(userid);
        }

        const coursesWithTeacherNames = await Promise.all(
          courses.map(async (course) => {
            const teacherName = await getTeacherFullNameByCourseID(
              course.CourseID
            );
            return { ...course, teacherName };
          })
        );

        setMyCourses(coursesWithTeacherNames);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalPages = Math.ceil(myCourses.length / rowsPerPage);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  const currmyCourses = myCourses.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  return (
    <>
      <MainTitle title="My Courses" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        itemsNums={itemsNums}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles["course-grid"]}>
            {currmyCourses?.map((item) => (
              <CourseCard
                key={item.CourseID}
                courseId={item.CourseNo}
                CourseName={item.CourseName}
                image={item.image}
                teacherName={item.teacherName}
                instructorAvtar={instructor1}
                classRoom={item.classRoom}
                classTime={item.Time}
                description={item.Description}
              />
            ))}
          </div>
        )}
      </TableContainer>
    </>
  );
}

export default MyCourses;
