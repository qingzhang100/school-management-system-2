// import { useNavigate, useParams } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { getProgramById, updateProgram } from "../../services/apiProgram.js";
// import ProgramForm from "../../components/Form/ProgramForm.js";

// function EditProgram() {
//   const { programId } = useParams();
//   const [data, setData] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setIsLoading(true);
//         setError("");
//         const programData = await getProgramById(programId);
//         setData(programData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchData();
//   }, [programId]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const handleUpdate = (e) => {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

//   const handleSave = async () => {
//     try {
//       await updateProgram(data);
//       alert("Update program successfully");
//       navigate("/programs/program-list");
//     } catch (err) {
//       alert("Failed to update program: " + err.message);
//     }
//   };

//   const handleBack = () => {
//     navigate("/programs/program-list");
//   };

//   return (
//     <div>
//       <h1>Program Management</h1>
//       <ProgramForm
//         mode="edit"
//         data={data}
//         handleUpdate={handleUpdate}
//         handleSave={handleSave}
//         handleBack={handleBack}
//       />
//     </div>
//   );
// }

// export default EditProgram;
