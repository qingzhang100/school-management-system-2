import ForgotPasswordForm from "../../components/Form/ForgotPasswordFrom";

function ForgotPassword({ setShowForgotPassword }) {
  return (
    <div>
      <ForgotPasswordForm setShowForgotPassword={setShowForgotPassword} />
    </div>
  );
}

export default ForgotPassword;
