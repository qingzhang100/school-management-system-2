import React, { useState } from "react";
import ProgramForm from "../../components/Form/ProgramForm.js";
import MainTitle from "../../ui/MainTitle/MainTitle.js";
function NewProgram() {
  const [formData, setFormData] = useState({
    ProgramName: "",
    ProgramCode: "",
  });
  const [error, setError] = useState(null);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <MainTitle title="New Course Category" goBack={true} />
      <ProgramForm mode="create" data={formData} />
    </div>
  );
}

export default NewProgram;
