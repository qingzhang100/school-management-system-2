import supabase from "../config/supabaseClient.js";

// Return Contact String
export async function getSchoolContact() {
  const { data, error } = await supabase.from("School").select("Contact");
  console.log("API getSchoolContact", data);
  if (error) {
    console.error(error);
    throw new Error("Fail to get contact from school table!~");
  }

  return data[0]?.Contact || "";
}

export async function updateSchoolContact(updatedData) {
  const schoolID = "d8d5caa0-5269-4c3c-8adc-f7590ded9eee";
  const { data, error } = await supabase
    .from("School")
    .update(updatedData)
    .eq("SchoolID", schoolID)
    .select();

  console.log("API update school info", data);

  if (error) {
    console.error("Error updating school information:", error.message);
    throw new Error("Failed to update school information.");
  }

  return data;
}
