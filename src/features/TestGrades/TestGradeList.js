import React, { useState, useEffect } from "react";
import TestGradeTable from "./TestGradeTable";
import Loader from "../../ui/Loader";
import { getTestGrades } from "../../services/apiTestGrade.js";

function TestGradeList() {
  const [testGradeData, setTestGradeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUserID = localStorage.getItem("UserID");
    const storedUserRole = localStorage.getItem("role");
    if (storedUserID) {
      setUserID(storedUserID);
      console.log('userID', JSON.stringify(storedUserID));
    } else {
      console.error("User ID is not found in local storage");
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
      console.log('userRole', storedUserRole);
    } else {
      console.error("User Role is not found in local storage");
    }
  }, []);

  useEffect(() => {
    async function fetchTestGrades() {
      if (!userID) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTestGrades(userID);
        setTestGradeData(data);
      } catch (error) {
        console.error("Error fetching test grades:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTestGrades();
  }, [userID]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Student Test Grades</h1>
      <TestGradeTable testGradeData={testGradeData} userRole={userRole} />
    </div>
  );
}

export default TestGradeList;
