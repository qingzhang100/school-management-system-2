// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getCourse, getCourseDetail, updateCourse } from "../../services/apiCourse";

// function CourseEdit() {
//   const { courseId } = useParams(); // Extract CourseID from URL
//   const [courseData, setCourseData] = useState({
//     CourseName: "",
//     CourseCode: "",
//     Description: "",
//     // Add other fields you want to edit, such as ProgramID, TeacherID, etc.
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const data = await getCourseDetail({ params: { ID: courseId } });
//         setCourseData(data);
//       } catch (error) {
//         console.error("Error fetching course:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [courseId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCourseData({ ...courseData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateCourse({ params: { ID: courseId }, data: courseData });
//       alert("Course updated successfully!");
//     } catch (error) {
//       console.error("Error updating course:", error);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading course details...</div>;
//   }

//   return (
//     <div>
//       <h1>Edit Course</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Course Name:</label>
//           <input
//             type="text"
//             name="CourseName"
//             value={courseData.CourseName}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Course Code:</label>
//           <input
//             type="text"
//             name="CourseCode"
//             value={courseData.CourseCode}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea
//             name="Description"
//             value={courseData.Description}
//             onChange={handleInputChange}
//           />
//         </div>
//         {/* Add fields for TeacherID, ProgramID, etc. */}
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// }

// export default CourseEdit;
