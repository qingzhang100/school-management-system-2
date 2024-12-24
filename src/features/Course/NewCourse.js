import NewCourseForm from "../../components/Form/NewCourseForm";
import MainTitle from "../../ui/MainTitle/MainTitle";
function NewCourse() {
  return (
    <div>
      <MainTitle title="New Course" />
      <NewCourseForm />
    </div>
  );
}

export default NewCourse;
