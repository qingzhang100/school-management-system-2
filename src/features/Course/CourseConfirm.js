import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";

function CourseConfirm({ type }) {
  const [branchData, setBranchData] = useState(null);
  const [error, setError] = useState(null);
  const { branchNo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UE Brancho is", branchNo);
    if (!branchNo) return;
    async function fetchBranchData() {
      try {
        const response = await fetch(
          `http://localhost:3900/api/branch/${branchNo}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch branch data");
        }
        const data = await response.json();

        if (data.length === 0) {
          throw new Error("No branch data found");
        }

        const branchArray = data[0];
        const transformedData = {
          branchNo: branchArray[0],
          street: branchArray[1],
          city: branchArray[2],
          postcode: branchArray[3],
        };

        setBranchData(transformedData);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchBranchData();
  }, [branchNo]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!branchData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {type === "new" && <h1>Branch Added</h1>}
      {type === "edit" && <h1>Branch Updated</h1>}
      <div>
        <p>Branch No.: {branchData.branchNo}</p>
        <p>Street: {branchData.street}</p>
        <p>City: {branchData.city}</p>
        <p>Postal Code: {branchData.postcode}</p>
      </div>
      <Button onClick={() => navigate("/dashboard/branch/branch-list")}>
        Go to branch list
      </Button>
    </>
  );
}

export default CourseConfirm;
