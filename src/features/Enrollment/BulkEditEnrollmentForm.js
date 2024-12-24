import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateEnrollments } from "../../services/apiEnrollment";
import Button from "../../components/Button/Button";
import MainTitle from "../../ui/MainTitle/MainTitle.js";
import EditContainer from "../../ui/Layout/EditContainer.js";

// Helper function to convert the date to Toronto time
const getFormattedDateForInput = (utcDate) => {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  // Adjust the date to local timezone by converting it to UTC first
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10); // YYYY-MM-DD format
};

function BulkEditEnrollmentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIds = location.state?.selectedIds || []; // Handle cases where state is null
  const [enrollmentDate, setEnrollmentDate] = useState(""); // Store in UTC
  const [isFinished, setIsFinished] = useState(null); // null to indicate "Keep"

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = {};
      if (enrollmentDate) {
        // Send the enrollment date in UTC format
        const utcDate = new Date(enrollmentDate).toISOString(); // Convert to UTC string
        updates.EnrollmentDate = utcDate;
      }
      if (isFinished !== null) {
        updates.isFinished = isFinished;
      }
      if (Object.keys(updates).length) {
        await updateEnrollments(
          selectedIds,
          updates.isFinished,
          updates.EnrollmentDate
        );
        alert("Enrollments updated successfully!");
      } else {
        // alert("No changes to update.");
      }
      navigate("/enrollments");
    } catch (error) {
      console.error("Error updating enrollments:", error);
      alert("Failed to update enrollments.");
    }
  };

  const handleCancel = () => {
    navigate("/enrollments");
  };

  if (!selectedIds.length) {
    return <div>No enrollments selected for bulk editing.</div>;
  }

  return (
    <>
      <MainTitle title="Bulk Edit Enrollments" goBack={true} />
      <EditContainer>
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            (Keep unchanged to maintain current state)
          </p>
          <form
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  fontSize: "16px",
                  color: "#555",
                  marginBottom: "8px",
                  display: "block",
                  fontWeight: "500",
                }}
              >
                Enrollment Date:
              </label>
              <input
                type="date"
                value={getFormattedDateForInput(enrollmentDate)} // Convert UTC to Toronto time for display
                onChange={(e) => setEnrollmentDate(e.target.value)} // Store as UTC
                placeholder="Keep"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "16px",
                  color: "#555",
                  marginBottom: "8px",
                  display: "block",
                  fontWeight: "500",
                }}
              >
                Is Finished
              </label>
              <input
                type="checkbox"
                checked={isFinished}
                onChange={
                  () => setIsFinished((prev) => (prev === null ? true : !prev)) // Handle null state
                }
                style={{ marginTop: "5px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button size="large" type="submit" style={{ width: "48%" }}>
                Update
              </Button>
              <Button
                size="large"
                type="button"
                onClick={handleCancel}
                style={{ width: "48%" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </EditContainer>
    </>
  );
}

export default BulkEditEnrollmentForm;
