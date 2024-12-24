import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ProgramForm from "../../components/Form/ProgramForm.js";
import MainTitle from "../../ui/MainTitle/MainTitle.js";
function NewProgram() {
  const [formData, setFormData] = useState({
    ProgramName: "",
    ProgramCode: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBack = () => {
    navigate("/programs/program-list");
  };

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
