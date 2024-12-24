import supabase from "../config/supabaseClient.js";

export async function getStudents() {
  const { data, error } = await supabase.from("Students").select(`
    *,
    Users (
      UserID,
      UserName,
      FirstName,
      LastName,
      Email,
      HomeAddress,
      DateOfBirth,
      PhoneNumber,
      UserNo
    ),
    Programs (
      ProgramName
    )
  `);

  // console.log("API getStudents", data);
  if (error) {
    console.error(error);
    throw new Error("Failed to load students");
  }

  return data;
}

// Create Student By User ID
export async function createStudentByUserId(UserId) {
  try {
    const defaultProgramID = "9af2aea3-0f6f-44e9-a6df-63d47f7a8e74"; // Default ProgramID

    // Proceed to insert the student with the default ProgramID
    const { data, error } = await supabase
      .from("Students")
      .insert([{ UserID: UserId, ProgramID: defaultProgramID }]); // Use default ProgramID

    if (error) {
      throw new Error("Failed to add student: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating student by UserId:", error);
    throw error;
  }
}

// updating a student
export async function updateStudent(UserNo, updatedData) {
  const { data, error } = await supabase
    .from("Users")
    .update(updatedData)
    .eq("UserNo", UserNo);

  if (error) {
    console.error("Failed to update student:", error);
    throw error;
  }

  return data;
}

// deleting a student
export async function deleteStudent(StudentNo) {
  const { data, error } = await supabase
    .from("Students")
    .delete()
    .eq("StudentNo", StudentNo);

  if (error) {
    handleError(error, "Failed to delete student");
  }

  return data;
}

// // get student by student number
// export async function getStudentByStudentNo(userNo) {
//   const { data, error } = await supabase
//     .from("Students")
//     .select(
//       `*,
//       Users (
//         UserNo,
//         UserID,
//         UserName,
//         FirstName,
//         LastName,
//         Email,
//         HomeAddress,
//         DateOfBirth,
//         PhoneNumber,
//         RoleID,
//         Roles: Roles (
//           RoleID,
//           RoleName
//         )
//       )`
//     )
//     .eq("Users.UserNo", userNo)
//     .single();

//   if (error) {
//     console.error("Failed to fetch student:", error);
//     throw error;
//   }

//   return data;
// }
// get student by student number
export async function getStudentByUserNo(userNo) {
  // get userID by userNo
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("UserNo", userNo)
    .single();

  if (userError) {
    console.error("Failed to fetch user:", userError);
    throw userError;
  }

  const userID = userData.UserID;
  // get student by userID
  const { data, error } = await supabase
    .from("Students")
    .select(
      `*,
      Users (
        UserNo,
        UserID,
        UserName,
        FirstName,
        LastName,
        Email,
        HomeAddress,
        DateOfBirth,
        PhoneNumber,
        RoleID,
        Roles: Roles (
          RoleID,
          RoleName
        )
      )`
    )
    .eq("UserID", userID)
    .single();

  console.log("API getStudentByUserNo", data);
  if (error) {
    console.error("Failed to fetch student:", error);
    throw error;
  }

  return data;
}

// error handling
function handleError(error, message) {
  console.error(error);
  throw new Error(message);
}

export async function getStudentNameForCourse(studentID) {
  // Get student by StudentID
  const { data, error } = await supabase
    .from("Students")
    .select(
      `*,
      Users (
        UserNo,
        UserID,
        UserName,
        FirstName,
        LastName,
        Email,
        HomeAddress,
        DateOfBirth,
        PhoneNumber,
        RoleID,
        Roles: Roles (
          RoleID,
          RoleName
        )
      )`
    )
    .eq("StudentID", studentID) // Query by StudentID instead of UserID
    .single();

  if (error) {
    console.error("Failed to fetch student:", error);
    throw error;
  }

  return data;
}

// get student enrollments
export async function getStudentEnrollments(userNo) {
  // get userID by userNo
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("UserNo", userNo)
    .single();

  if (userError) {
    console.error("Failed to fetch user:", userError);
    throw userError;
  }

  const userID = userData.UserID;
  // get studentID by userID
  const { data: studentData, error: studentError } = await supabase
    .from("Students")
    .select("StudentID")
    .eq("UserID", userID)
    .single();

  if (studentError) {
    console.error("Failed to fetch student:", studentError);
    throw studentError;
  }

  const studentID = studentData.StudentID;
  // get enrollments by studentID
  const { data, error } = await supabase
    .from("Enrollments")
    .select(
      `
      CourseID,
      Courses (
        CourseName,
        StartDate,
        EndDate,
        Time
      )
    `
    )
    .eq("StudentID", studentID);

  if (error) {
    console.error("Failed to fetch enrollments:", error);
    throw error;
  }

  return data.map((enrollment) => ({
    CourseID: enrollment.CourseID,
    CourseName: enrollment.Courses.CourseName,
    StartDate: enrollment.Courses.StartDate,
    EndDate: enrollment.Courses.EndDate,
    Time: enrollment.Courses.Time,
  }));
}

export async function getStudentCoursesByUserID(userID) {
  try {
    const { data: studentData, error: studentError } = await supabase
      .from("Students")
      .select("StudentID")
      .eq("UserID", userID)
      .single();

    if (studentError) {
      throw new Error("Failed to fetch student data: " + studentError.message);
    }

    const studentID = studentData.StudentID;

    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from("Enrollments")
      .select("CourseID")
      .eq("StudentID", studentID);

    if (enrollmentError) {
      throw new Error(
        "Failed to fetch enrollment data: " + enrollmentError.message
      );
    }

    const courseIDs = enrollmentData.map((enrollment) => enrollment.CourseID);

    const { data: coursesData, error: coursesError } = await supabase
      .from("Courses")
      .select("*")
      .in("CourseID", courseIDs);

    if (coursesError) {
      throw new Error("Failed to fetch courses data: " + coursesError.message);
    }

    return coursesData;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw error;
  }
}

// Search students based on a keyword
export async function searchStudents(keyword) {
  // Used front-end search to implement this feature
}
