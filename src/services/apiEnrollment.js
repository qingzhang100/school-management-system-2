import supabase from "../config/supabaseClient.js";

export async function getEnrollments() {
  const { data, error } = await supabase.from("Enrollments").select(`
      *,
      Students (
        StudentID,
        UserID,
        Users (
          UserID,
          FirstName,
          LastName
        )
      ),
      Courses (
        CourseID,
        CourseName
      )
    `);
  if (error) {
    console.error("Error fetching enrollments:", error);
  } else {
    console.log("Enrollments with student and course names:", data);
  }
  return data;
}

export async function insertEnrollment(
  studentId,
  courseId,
  enrollmentDate,
  isFinished
) {
  const { data, error } = await supabase.from("Enrollments").insert([
    {
      StudentID: studentId,
      CourseID: courseId,
      EnrollmentDate: enrollmentDate, // Add enrollment date
      isFinished: isFinished, // Add isFinished boolean
    },
  ]);

  if (error) {
    throw new Error("Error inserting enrollment: " + error.message);
  }
  return data;
}
//multiple
export async function insertEnrollments(enrollmentData) {
  const { data, error } = await supabase
    .from("Enrollments")
    .insert(enrollmentData); // Pass the array of enrollment objects

  if (error) {
    throw new Error("Error inserting enrollments: " + error.message);
  }
  return data;
}
// New update function for multiple IDs
export async function updateEnrollments(
  EnrollmentIDs,
  isFinished,
  enrollmentDate
) {
  const { data, error } = await supabase
    .from("Enrollments")
    .update({
      isFinished: isFinished,
      EnrollmentDate: enrollmentDate,
    })
    .in("EnrollmentID", EnrollmentIDs);
  if (error) {
    throw new Error("Error updating enrollments: " + error.message);
  }
  return data;
}

// New update function for a single enrollment
export async function updateEnrollment(
  EnrollmentID,
  enrollmentDate,
  isFinished
) {
  const { data, error } = await supabase
    .from("Enrollments")
    .update({
      isFinished: isFinished,
      EnrollmentDate: enrollmentDate,
    })
    .eq("EnrollmentID", EnrollmentID); // Filtering by the specific id to update the record

  if (error) {
    throw new Error("Error updating enrollment: " + error.message);
  }

  return data;
}

// Fetch enrollment details by ID
export async function getEnrollmentDetails(id) {
  const { data, error } = await supabase
    .from("Enrollments")
    .select(
      `
      *,
      Students (
        StudentID,
        UserID,
        Users (
          UserID,
          FirstName,
          LastName
        )
      ),
      Courses (
        CourseID,
        CourseName,
        CourseNo
      )
    `
    )
    .eq("EnrollmentID", id.params.id)
    .single(); // Ensures only one record is fetched

  if (error) {
    console.error("Error fetching enrollment details:", error);
  } else {
    console.log("Enrollment details with student and course names:", data);
  }
  return data;
}

export async function updateEnrollmentStatus(EnrollmentID, isFinished) {
  try {
    const { data, error } = await supabase
      .from("Enrollments")
      .update({
        isFinished: isFinished,
      })
      .eq("EnrollmentID", EnrollmentID);

    if (error) {
      throw new Error(`Error updating enrollment status: ${error.message}`);
    }

    console.log("Updated enrollment status:", data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Delete enrollment by StudentID and CourseID
export async function deleteEnrollment(studentId, courseId) {
  try {
    const { data, error } = await supabase.from("Enrollments").delete().match({
      StudentID: studentId,
      CourseID: courseId,
    });

    if (error) {
      throw new Error(`Error deleting enrollment: ${error.message}`);
    }
    console.log("Deleted enrollment:", data);
    return data;
  } catch (err) {
    console.error("Failed to delete enrollment:", err);
    throw err;
  }
}
