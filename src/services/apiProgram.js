import supabase from "../config/supabaseClient.js";

export async function getProgramList() {
  const { data, error } = await supabase.from("Programs").select(`
   ProgramName,
   ProgramCode,
   ProgramNo,
   ProgramID
  `);

  console.log(data);
  if (error) {
    console.error(error);
    throw new Error("Failed to load programs");
  }

  return data;
}

export async function getProgramByCode(programCode) {
  const { data, error } = await supabase
    .from("Programs")
    .select(
      `
        ProgramCode,
        ProgramName,
        ProgramDescription,
        ProgramID  
    `
    )
    .eq("ProgramCode", programCode)
    .single();

  console.log("API getProgramByCode", data);
  if (error) {
    console.error(error);
    throw new Error("Failed to load program");
  }

  return data;
}

export async function getCoursesByProgramID(programID) {
  const { data, error } = await supabase
    .from("Courses")
    .select(`*`)
    .eq("ProgramID", programID);

  if (error) {
    console.error(error);
    throw new Error("Failed to load courses for the program");
  }

  return data;
}

export async function updateProgram(updatedData) {
  // console.log("updatedData" + JSON.stringify(updatedData));
  const { data, error } = await supabase
    .from("Programs")
    .update({
      ProgramCode: updatedData.ProgramCode,
      ProgramName: updatedData.ProgramName,
      ProgramDescription: updatedData.ProgramDescription,
    })
    .eq("ProgramCode", updatedData.ProgramCode)
    .select("*");
  if (error) {
    console.error(error);
    throw new Error("Failed to update program");
  }
  return data;
}

export async function addProgram(programData) {
  const { data, error } = await supabase.from("Programs").insert([programData]);

  if (error) {
    console.error(error);
    throw new Error("Failed to add program");
  }
  return data;
}

export async function sortProgramsBy(fieldName = "ProgramCode", ascending = true) {
  try {
    let updatedFieldName;
    if(fieldName == "CourseCategoryCode"){
      updatedFieldName = "ProgramCode"
    } 
    if(fieldName =="CourseCategoryName"){
      updatedFieldName = "ProgramName"
    }
    const { data, error } = await supabase
      .from("Programs")
      .select(`
        ProgramCode,
        ProgramName,
        ProgramDescription,
        ProgramID
      `)
      .order(updatedFieldName, { ascending });

    if (error) {
      console.error("Error fetching sorted programs:", error);
      throw new Error("Failed to load sorted programs");
    }

    console.log("Sorted Programs:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error in sortProgramsBy:", error);
    throw error;
  }
}


//export async function FilterProgramByField(fieldName = "ProgramCode", ascending = true) {
 // try {
    // Valid field names to prevent SQL injection
    // const validFields = ["ProgramCode", "ProgramName", "ProgramDescription", "ProgramID"];
    
    // if (!validFields.includes(fieldName)) {
    //   throw new Error(`Invalid field name for sorting: ${fieldName}`);
    // }

    // Fetch programs grouped by ProgramCode and ProgramName
//     const { data, error } = await supabase
//       .from("Programs")
//       .select(`
//         ProgramCode,
//         ProgramName,
//         ProgramDescription,
//         ProgramID
//       `)
//       .order(fieldName, { ascending });

//     if (error) {
//       console.error("Error fetching sorted programs:", error);
//       throw new Error("Failed to load sorted programs");
//     }

//     // Filter the data to only include records where ProgramCode is not null
//     const filteredData = data.filter(
//       (program) => program.ProgramCode !== null
//     );

//     console.log("Filtered and Sorted Programs:", filteredData);
//     return filteredData;
//   } catch (error) {
//     console.error("Unexpected error in filterAndSortPrograms:", error);
//     throw error;
//   }
// }

