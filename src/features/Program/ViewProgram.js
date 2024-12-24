import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProgramByCode,
  getCoursesByProgramID,
} from "../../services/apiProgram.js";
import MainTitle from "../../ui/MainTitle/MainTitle.js";
import ProgramForm from "../../components/Form/ProgramForm.js";
import formStyles from "../../components/Form/Form.module.css";
import EditContainer from "../../ui/Layout/EditContainer.js";

function ViewProgram() {
  const { programCode } = useParams();
  const [programData, setProgramData] = useState({});
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProgramAndCourses() {
      try {
        setIsLoading(true);
        setError("");
        const program = await getProgramByCode(programCode);
        setProgramData(program);

        const courses = await getCoursesByProgramID(program.ProgramID);
        setCourses(courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgramAndCourses();
  }, [programCode]);

  const handleBack = () => {
    navigate("/programs/program-list");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <MainTitle
        title={
          isLoading
            ? `Course Category Detail`
            : `Category Detail: ${programData.ProgramName}`
        }
        goBack={true}
        onBack={handleBack}
      />
      <div className={formStyles.profileFormLayout}>
        <ProgramForm mode="view" data={programData} isLoading={isLoading} />
        <EditContainer title="Courses in this category">
          {isLoading ? (
            <p>Loading courses...</p>
          ) : courses.length > 0 ? (
            <table className={formStyles.courseTable}>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course No</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.CourseID}>
                    <td>{course.CourseName}</td>
                    <td>{course.CourseNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No courses available for this program.</p>
          )}
        </EditContainer>
      </div>
    </div>
  );
}

export default ViewProgram;
