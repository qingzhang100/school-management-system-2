import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestGradeByID, updateTestGrade } from "../../services/apiTestGrade.js";
import Loader from "../../ui/Loader";

function TestGradeForm() {
  const { gradeId } = useParams();
  const [grade, setGrade] = useState({
    Quizz1: "",
    Quizz2: "",
    Quizz3: "",
    Quizz4: "",
    Quizz5: "",
    Midterm: "",
    Final: "",
    AverageGrade: "",
    isPassed: "",
    firstName: "",
    lastName: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGrade() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTestGradeByID(gradeId);
       // console.log('data ' + JSON.stringify(data));
        setGrade({
          Quizz1: data[0].Quizz1,
          Quizz2: data[0].Quizz2,
          Quizz3: data[0].Quizz3,
          Quizz4: data[0].Quizz4,
          Quizz5: data[0].Quizz5,
          Midterm: data[0].Midterm,
          Final: data[0].Final,
          AverageGrade: data[0].AverageGrade,
          isPassed: data[0].isPassed,
          firstName: data[0].Students.Users.FirstName,
          lastName: data[0].Students.Users.LastName
        });
      } catch (error) {
        console.error("Error fetching grade:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGrade();
  }, [gradeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "isPassed" ? value : Number(value);
    setGrade((prevGrade) => ({ ...prevGrade, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTestGrade(gradeId, grade);
      navigate("/my-grades"); // Redirect to the grades list page after updating
    } catch (error) {
      console.error("Failed to update grade:", error);
      setError(error.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="generalStyles_container__RvMgt generalStyles_white__kHts0">
      <h1>Update Grade</h1>
      <br/>
      <label>
        First Name:
        <input type="text" name="firstName" className="Form_formInput__xdpGx" value={grade.firstName} disabled />
      </label>
      <label>
        Last Name:
        <input type="text" name="lastName" className="Form_formInput__xdpGx" value={grade.lastName} disabled />
      </label>
      <label>
        Quiz 1:
        <input type="number" name="Quizz1" className="Form_formInput__xdpGx" value={grade.Quizz1} onChange={handleChange} />
      </label>
      <label>
        Quiz 2:
        <input type="number" name="Quizz2" className="Form_formInput__xdpGx" value={grade.Quizz2} onChange={handleChange} />
      </label>
      <label>
        Quiz 3:
        <input type="number" name="Quizz3" className="Form_formInput__xdpGx" value={grade.Quizz3} onChange={handleChange} />
      </label>
      <label>
        Quiz 4:
        <input type="number" name="Quizz4" className="Form_formInput__xdpGx" value={grade.Quizz4} onChange={handleChange} />
      </label>
      <label>
        Quiz 5:
        <input type="number" name="Quizz5" className="Form_formInput__xdpGx" value={grade.Quizz5} onChange={handleChange} />
      </label>
      <label>
        Midterm:
        <input type="number" name="Midterm" className="Form_formInput__xdpGx" value={grade.Midterm} onChange={handleChange} />
      </label>
      <label>
        Final:
        <input type="number" name="Final" className="Form_formInput__xdpGx" value={grade.Final} onChange={handleChange} />
      </label>
      <label>
        Average Grade:
        <input type="number" name="AverageGrade" className="Form_formInput__xdpGx" value={grade.AverageGrade} onChange={handleChange} />
      </label>
      <label>
        Passed:
        <select className="Form_formInput__xdpGx" name="isPassed" value={grade.isPassed} onChange={handleChange}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </label>
      <br/><br/>
      <button type="submit" className="Button_btn__58t-o Button_small__c9FMV Button_rose__LaWgJ">Update Grade</button>
      <button type="cancel" style={{ marginLeft: 20 + 'px'}} className="Button_btn__58t-o Button_small__c9FMV Button_rose__LaWgJ" onClick={() => navigate(`/my-grades`)}>Cancel</button>
    </form>
  );
}

export default TestGradeForm;
