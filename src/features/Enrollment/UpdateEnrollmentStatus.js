import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateEnrollment } from "../../services/apiEnrollment.js"; // Import update function
import { getEnrollmentDetails } from "../../services/apiEnrollment.js"; // Import fetch function
import Button from "../../components/Button/Button.js";
import MainTitle from "../../ui/MainTitle/MainTitle.js";
import styles from "../../../src/components/Form/Form.module.css";
import EditContainer from "../../ui/Layout/EditContainer.js";

function UpdateEnrollmentStatus() {
  const { enrollmentid } = useParams();
  const navigate = useNavigate();
  const [enrollmentDate, setEnrollmentDate] = useState(""); // For storing date in UTC
  const [isFinished, setIsFinished] = useState(null);

  // Convert UTC date to Toronto local time for display
  const convertToLocalTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
  };

  // Fetch enrollment details by ID and set default values
  useEffect(() => {
    async function fetchEnrollmentDetails() {
      try {
        const data = await getEnrollmentDetails(enrollmentid);
        if (data) {
          // Set the form's date input to local time (keep in UTC)
          setEnrollmentDate(data.EnrollmentDate); // Store in UTC
          setIsFinished(data.isFinished); // Set the isFinished value
        }
      } catch (error) {
        console.error("Error fetching enrollment details:", error);
      }
    }

    fetchEnrollmentDetails();
  }, [enrollmentid]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update the enrollment, send date in UTC format (no time zone adjustment here)
      await updateEnrollment(enrollmentid, enrollmentDate, isFinished);
      // On success, navigate to the enrollment list
      navigate("/enrollments");
    } catch (error) {
      console.error("Error updating enrollment:", error);
      alert("Failed to update enrollment. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/enrollments"); // Cancel and go back to the list
  };

  // Function to get the correct date string for the input field
  const getFormattedDateForInput = () => {
    if (!enrollmentDate) return "";
    const date = new Date(enrollmentDate);
    // Adjust for timezone difference
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10); // Convert to YYYY-MM-DD format
  };

  return (
    <>
      <MainTitle title="Update Enrollment Status" goBack={true} />
      <EditContainer>
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
          <form
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ flexDirection: "column" }}>
              <div className={styles.formItem}>
                <label
                  style={{
                    fontSize: "16px",
                    color: "#555",
                    marginBottom: "8px",
                    display: "block",
                    fontWeight: "500",
                  }}
                >
                  Enrollment Date
                </label>
                <input
                  type="date"
                  value={getFormattedDateForInput()} // Use formatted date
                  onChange={(e) => setEnrollmentDate(e.target.value)} // Store the date in UTC
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                  }}
                />
                {/* Optionally, show the local time for reference */}
                <div>
                  {enrollmentDate && (
                    <small style={{ color: "#888", marginTop: "8px" }}>
                      Local Date (Toronto): {convertToLocalTime(enrollmentDate)}
                    </small>
                  )}
                </div>
              </div>
              <div className={styles.formItem}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={isFinished}
                    onChange={() =>
                      setIsFinished((prev) => (prev === null ? true : !prev))
                    }
                    style={{ marginRight: "8px" }}
                  />
                </div>
              </div>
            </div>
            <div
              className={styles.buttons}
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

export default UpdateEnrollmentStatus;
