import formStyles from "./Form.module.css";
import { useState, useEffect } from "react";
import EditContainer from "../../ui/Layout/EditContainer";
import { getSecurityInfoByNo as getSecurityInfoByNo } from "../../services/apiUser";
import { useNavigate } from "react-router-dom";

function SecurityInfoForm({ userNo, showEditButton }) {
  const [inputData, setInputData] = useState({
    UserName: "",
    PasswordHash: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getSecurityInfo() {
      try {
        const { UserName, PasswordHash } = await getSecurityInfoByNo(userNo);
        setInputData({
          UserName,
          PasswordHash,
        });
      } catch (err) {
        console.log(err);
      }
    }

    getSecurityInfo();
  }, [userNo]);

  function resetPassword() {
    navigate("/dashboard/reset-password", {
      state: { username: inputData.UserName },
    });
  }
  return (
    <EditContainer
      title="Security Information"
      editButtonText="Reset Password"
      onClickEdit={resetPassword}
      showEditButton={showEditButton}
    >
      <form>
        <div className={formStyles.formRow}>
          <div className={formStyles.formItem}>
            <label htmlFor="username" className={formStyles.formLabel}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className={formStyles.formInput}
              disabled
              value={inputData.UserName}
            />
          </div>
          <div className={formStyles.formItem}>
            <label htmlFor="password" className={formStyles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={formStyles.formInput}
              value={inputData.PasswordHash}
              disabled
            />
          </div>
        </div>
      </form>
    </EditContainer>
  );
}

export default SecurityInfoForm;
