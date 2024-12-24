import supabase from "../config/supabaseClient.js";

export async function getTeachers() {
  const { data, error } = await supabase.from("Teachers").select(`
    *,
    Users (
      UserNo,
      UserName,
      FirstName,
      LastName,
      Email,
      HomeAddress,
      DateOfBirth,
      PhoneNumber
    )
  `);

  if (error) {
    console.error(error);
    throw new Error("Failed to load teachers");
  }

  return data;
}

export async function getTeacherIdByUserNo(userNo) {
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("UserNo", userNo);

  if (userError) {
    console.error("Error fetching UserID by UserNo:", userError);
    throw new Error("Failed to load user data");
  }

  if (userData && userData.length > 0) {
    const userID = userData[0].UserID;

    const { data: teacherData, error: teacherError } = await supabase
      .from("Teachers")
      .select("TeacherID")
      .eq("UserID", userID);

    if (teacherError) {
      console.error("Error fetching TeacherID by UserID:", teacherError);
      throw new Error("Failed to load teacher ID");
    }

    if (teacherData && teacherData.length > 0) {
      return teacherData[0].TeacherID;
    } else {
      throw new Error("Teacher not found for the given UserID");
    }
  } else {
    throw new Error("User not found for the given UserNo");
  }
}

export async function getExistingTeacherNo() {
  try {
    const { data, error } = await supabase
      .from("Teachers")
      .select("TeacherNo")
      .order("TeacherNo", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch existing TeacherNo!");
    }

    return data.length > 0 ? data[0].TeacherNo : 0;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch existing TeacherNo!");
  }
}

export async function getTeacherCoursesByUserID(userID) {
  try {
    const { data: teacherData, error: teacherError } = await supabase
      .from("Teachers")
      .select("TeacherID")
      .eq("UserID", userID)
      .single();

    if (teacherError) {
      console.error("Error retrieving TeacherID:", teacherError);
      throw new Error("Failed to load TeacherID");
    }

    const teacherID = teacherData.TeacherID;

    const { data: coursesData, error: coursesError } = await supabase
      .from("Courses")
      .select("*")
      .eq("TeacherID", teacherID);

    if (coursesError) {
      console.error("Error retrieving teacher's courses:", coursesError);
      throw new Error("Failed to load teacher's courses");
    }

    return coursesData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// get teacher's courses by userID
export async function getTeacherCourses(userNo) {
  try {
    // get userID
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

    // get teacherID
    const { data: teacherData, error: teacherError } = await supabase
      .from("Teachers")
      .select("TeacherID")
      .eq("UserID", userID)
      .single();
    if (teacherError) {
      console.error("Error retrieving TeacherID:", teacherError);
      throw new Error("Failed to load TeacherID");
    }
    const teacherID = teacherData.TeacherID;

    // get courses
    const { data: coursesData, error: coursesError } = await supabase
      .from("Courses")
      .select("*")
      .eq("TeacherID", teacherID);
    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      throw new Error("Failed to fetch courses");
    }
    return coursesData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function assignCourseToTeacher(courseid, teacherid) {
  try {
    if (!courseid || !teacherid) {
      throw new Error("Both CourseID and TeacherID are required.");
    }

    // Update the course with the new TeacherID
    const { data: updateData, error: updateError } = await supabase
      .from("Courses")
      .update({ TeacherID: teacherid }) // Set the new TeacherID
      .eq("CourseID", courseid); // Match the course by its ID

    if (updateError) {
      console.error("Error assigning course to teacher:", updateError);
      throw new Error("Failed to assign course to teacher.");
    }

    // If update is successful, query the course data to confirm the update
    const { data: courseData, error: selectError } = await supabase
      .from("Courses")
      .select("*")
      .eq("CourseID", courseid)
      .single(); // Get a single course to confirm

    if (selectError) {
      console.error("Error fetching updated course:", selectError);
      throw new Error("Failed to fetch updated course data.");
    }

    console.log("Updated course data:", courseData);
    return { success: true, data: courseData }; // Return the updated course data
  } catch (err) {
    console.error(err);
    throw new Error("An unexpected error occurred while assigning the course.");
  }
}

export async function removeCourseFromTeacher(courseData) {
  const { CourseID, TeacherID } = courseData;

  // Check if CourseID and TeacherID are provided
  if (!CourseID || !TeacherID) {
    throw new Error("CourseID and TeacherID are required");
  }

  try {
    // Update the Courses table to remove the TeacherID
    const { data, error } = await supabase
      .from("Courses")
      .update({ TeacherID: null })
      .eq("CourseID", CourseID)
      .eq("TeacherID", TeacherID);

    if (error) {
      console.error("Error removing teacher from course:", error);
      throw new Error("Failed to remove teacher from course");
    }

    return {
      success: true,
      message: "Teacher removed from course successfully",
      data, // Return the updated course data
    };
  } catch (error) {
    console.error("Error removing teacher from course:", error);
    throw new Error("Failed to remove teacher from course");
  }
}

export async function sortTeachersBy(fieldName = "UserNo", ascending = true) {
  try {
    // Define valid fields for sorting to prevent SQL injection
    const validFields = [
      "UserNo",
      "UserName",
      "FirstName",
      "LastName",
      "Email",
      "HomeAddress",
      "DateOfBirth",
      "PhoneNumber",
    ];

    // Validate that fieldName is one of the valid fields
    if (!validFields.includes(fieldName)) {
      throw new Error(`Invalid field name for sorting: ${fieldName}`);
    }

    // Fetch sorted teacher data
    const { data, error } = await supabase
      .from("Teachers")
      .select(
        `
        *,
        Users (
          UserNo,
          UserName,
          FirstName,
          LastName,
          Email,
          HomeAddress,
          DateOfBirth,
          PhoneNumber
        )
      `
      )
      .order(`Users.${fieldName}`, { ascending }); // Order by field in Users table

    if (error) {
      console.error("Error fetching sorted teachers:", error);
      throw new Error("Failed to load sorted teachers");
    }

    console.log("Sorted Teachers:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error in sortTeachersBy:", error);
    throw error;
  }
}

export async function getTeacherIdByCourseId(courseId) {
  try {
    const { data, error } = await supabase
      .from("Courses")
      .select("TeacherID")
      .eq("CourseID", courseId)
      .single();

    if (error) {
      console.error("Error fetching TeacherID by CourseID:", error);
      throw new Error("Failed to load TeacherID for the given CourseID");
    }

    if (data) {
      return data.TeacherID;
    } else {
      throw new Error("Course not found for the given CourseID");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw new Error("An unexpected error occurred while fetching TeacherID");
  }
}

// Create Student By User ID
export async function createTeacherByUserId(UserId) {
  try {
    const defaultProgramID = "9af2aea3-0f6f-44e9-a6df-63d47f7a8e74"; // Default ProgramID

    // Proceed to insert the student with the default ProgramID
    const { data, error } = await supabase
      .from("Teachers")
      .insert([{ UserID: UserId, ProgramID: defaultProgramID }]); // Use default ProgramID

    if (error) {
      throw new Error("Failed to add teacher: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating teacher by UserId:", error);
    throw error;
  }
}
