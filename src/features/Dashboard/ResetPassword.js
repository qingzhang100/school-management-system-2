import ResetPasswordForm from "../../components/Form/ResetPasswordForm";
import MainTitle from "../../ui/MainTitle/MainTitle";

function ResetPassword() {
  return (
    <div>
      <MainTitle title={"Reset Password"} goBack={true} />
      <ResetPasswordForm />
    </div>
  );
}

export default ResetPassword;
