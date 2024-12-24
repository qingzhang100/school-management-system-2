import supabase from "../config/supabaseClient.js";

export async function getCourses() {
  const { data, error } = await supabase.from("Courses").select(`
      *,
      Teachers (
        TeacherID,
        Users (
          UserNo,
          FirstName,
          LastName
        )
      )
    `);

  console.log(data);

  if (error) {
    console.error(error);
    throw new Error("Failed to load courses");
  }

  return data;
}

export async function getCourseDetail({ params }) {
  const { ID } = params;

  const { data: courseData, error: courseError } = await supabase
    .from("Courses")
    .select(
      `
      *,
      Programs (
        ProgramID,
        ProgramName,
        ProgramCode
      ),  Teachers(
        TeacherID
      )
    `
    )
    .eq("CourseNo", ID)
    .single();

  if (courseError) {
    console.error(courseError);
    throw new Error("Failed to load course");
  }

  const { data: teacherData, error: teacherError } = await supabase
    .from("Teachers")
    .select("UserID")
    .eq("TeacherID", courseData.Teachers.TeacherID)
    .single();

  if (teacherError) {
    console.error(teacherError);
    throw new Error("Failed to load teacher data");
  }

  const userID = teacherData.UserID;

  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID, UserName, FirstName, LastName, Email")
    .eq("UserID", userID)
    .single();

  if (userError) {
    console.error(userError);
    throw new Error("Failed to load user data");
  }

  const fullCourseData = {
    ...courseData,
    TeacherUser: userData,
  };

  console.log("API getCourseDetail", fullCourseData);
  return fullCourseData;
}

export async function deleteCourse(courseID) {
  const { error } = await supabase
    .from("Courses")
    .delete()
    .eq("CourseID", courseID);

  if (error) {
    throw new Error("Failed to delete course: " + error.message);
  }
}

export async function updateCourse(courseNo, updatedData) {
  console.log("Updating course with courseNo:", courseNo);
  console.log("Data being updated:", updatedData);

  try {
    const { data, error } = await supabase
      .from("Courses")
      .update(updatedData)
      .eq("CourseNo", courseNo)
      .select("*");

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error("Failed to update course: " + error.message);
    }

    console.log("Update successful, returned data:", data);
    return data;
  } catch (error) {
    console.error("General update error:", error);
    throw error;
  }
}

export async function addCourse(courseData) {
  const {
    CourseName,
    Description,
    TeacherID,
    ProgramID,
    StartDate,
    EndDate,
    Time,
  } = courseData;

  const { data, error } = await supabase.from("Courses").insert([
    {
      CourseName,
      Description,
      TeacherID,
      ProgramID,
      StartDate: StartDate || null,
      Time: Time || null,
      EndDate: EndDate || null,
    },
  ]);

  if (error) {
    console.error("Error adding course:", error);
    throw new Error("Failed to add course");
  }

  return data;
}

export async function getTeacherFullNameByCourseID(courseID) {
  const { data: courseData, error: courseError } = await supabase
    .from("Courses")
    .select("TeacherID")
    .eq("CourseID", courseID)
    .single();

  if (courseError) {
    console.error("Error fetching course data:", courseError);
    throw new Error("Failed to fetch course data");
  }

  const teacherID = courseData.TeacherID;

  const { data: teacherData, error: teacherError } = await supabase
    .from("Teachers")
    .select("UserID")
    .eq("TeacherID", teacherID)
    .single();

  if (teacherError) {
    console.error("Error fetching teacher data:", teacherError);
    throw new Error("Failed to fetch teacher data");
  }

  const userID = teacherData.UserID;

  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("FirstName, LastName")
    .eq("UserID", userID)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    throw new Error("Failed to fetch user data");
  }

  const fullName = `${userData.FirstName} ${userData.LastName}`;
  return fullName;
}

export async function searchCourses(query) {
  if (!query) return await getCourses();

  const { data, error } = await supabase
    .from("Courses")
    .select("*")
    .ilike("CourseName", `%${query}%`)
    .or(`Description.ilike.%${query}%`)
    .order("CourseName", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Failed to search courses");
  }

  return data;
}

export async function sortCoursesBy(fieldName = "CourseNo", ascending = true) {
  try {
    console.log("Sorting by field:", fieldName, "Ascending:", ascending);
    const { data, error } = await supabase
      .from("Courses")
      .select(`*`)
      .order(fieldName, { ascending });

    if (error) {
      console.error("Error fetching sorted courses:", error.message);
      throw new Error("Failed to load sorted courses");
    }

    console.log("Sorted Courses:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error in sortCoursesBy:", error.message);
    throw error;
  }
}
