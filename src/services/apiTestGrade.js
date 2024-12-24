import supabase from "../config/supabaseClient.js";

export async function getTestGrades(userID) {
  console.log('getTestGrade ' + userID);
  const { data, error } = await supabase
  .from("TestGrades")
    .select(`
     TestGradeNo, Quizz1, Quizz2, Quizz3, Quizz4, Quizz5, Midterm, Final, 
     AverageGrade, isPassed, 
     Courses (CourseID, CourseName),
     Students ( StudentID, UserID, 
     Users:UserID ( FirstName, LastName ) )
    `)
  //.eq("Students.UserID", userID);

  if (error) {
    console.error("Failed to fetch test grades:", error);
    throw new Error("Failed to fetch test grades");
  }
  //console.log('@@data ' + JSON.stringify(data));
  return data;
}

export async function getTestGradeByID(gradeId) {
  const { data, error } = await supabase
    .from("TestGrades")
    .select(`
     TestGradeNo, Quizz1, Quizz2, Quizz3, Quizz4, Quizz5, Midterm, Final, 
     AverageGrade, isPassed, 
     Courses (CourseID, CourseName),
     Students ( StudentID, UserID, 
     Users:UserID ( FirstName, LastName ) )
    `)
    .eq("TestGradeNo", gradeId);

  if (error) {
    console.error("Failed to fetch test grades:", error);
    throw new Error("Failed to fetch test grades");
  }
 // console.log('data ' + JSON.stringify(data));
  return data;
}

// Add a new test grade
export async function addTestGrade(testGrade) {
  const { data, error } = await supabase
    .from("TestGrade")
    .insert([testGrade]);

  if (error) {
    console.error("Failed to add test grade:", error);
    throw new Error("Failed to add test grade");
  }

  return data;
}

export async function updateTestGrade(testGradeID, updatedData) {
  const { data, error } = await supabase
    .from("TestGrades") // Ensure this matches your table name
    .update({
      Quizz1: updatedData.Quizz1,
      Quizz2: updatedData.Quizz2,
      Quizz3: updatedData.Quizz3,
      Quizz4: updatedData.Quizz4,
      Quizz5: updatedData.Quizz5,
      Midterm: updatedData.Midterm,
      Final: updatedData.Final,
      AverageGrade: updatedData.AverageGrade,
      isPassed: updatedData.isPassed
    })
    .eq("TestGradeNo", testGradeID); // Ensure the column name matches your DB schema

  if (error) {
    console.error("Failed to update test grade:", error);
    throw new Error("Failed to update test grade");
  }

  return data;
}

// Delete a test grade
export async function deleteTestGrade(testGradeID) {
  const { data, error } = await supabase
    .from("TestGrade")
    .delete()
    .eq("TestGradeID", testGradeID);

  if (error) {
    console.error("Failed to delete test grade:", error);
    throw new Error("Failed to delete test grade");
  }

  return data;
}

// Error handling function
function handleError(error, message) {
  console.error(error);
  throw new Error(message);
}
