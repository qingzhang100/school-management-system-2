import EditContainer from "../../ui/Layout/EditContainer";
import formStyles from "./Form.module.css";
import { getAccountInfoByNo } from "../../services/apiUser";
import { useState, useEffect } from "react";

function AccountInfoForm({ userNo, showEditButton }) {
  const [inputData, setInputData] = useState({
    RoleName: "",
    IsLockedOut: false,
    FailedPasswordAttempt: 0,
    IsAdmin: false,
    CreatedAt: "",
    LastLoginDate: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function getAccountInfo() {
      try {
        const {
          Roles,
          IsLockedOut,
          FailedPasswordAttempt,
          IsAdmin,
          CreatedAt,
          LastLoginDate,
        } = await getAccountInfoByNo(userNo);

        setInputData({
          RoleName: Roles?.RoleName,
          IsLockedOut,
          FailedPasswordAttempt,
          CreatedAt: CreatedAt || "",
          LastLoginDate: LastLoginDate || "",
          IsAdmin,
        });
      } catch (err) {
        console.log(err);
      }
    }

    getAccountInfo();
  }, [userNo]);

  function handleChange(e) {
    const { name, value } = e.target;

    const updatedValue =
      name === "FailedPasswordAttempt" ? Number(value) : value;

    setInputData({ ...inputData, [name]: updatedValue });
  }

  return (
    <EditContainer title="Account Information">
      <div>
        <form>
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="role-name" className={formStyles.formLabel}>
                Role
              </label>
              <input
                type="text"
                id="roleName"
                name="RoleName"
                className={formStyles.formInput}
                disabled={!isEdit}
                value={inputData.RoleName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="created-at" className={formStyles.formLabel}>
                Account Created At
              </label>
              <input
                type="date"
                id="created-at"
                name="CreatedAt"
                className={formStyles.formInput}
                disabled={true}
                value={inputData.CreatedAt}
              />
            </div>
          </div>
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="isAdmin" className={formStyles.formLabel}>
                I.D. Verified
              </label>
              <select
                value={inputData.IsAdmin}
                className={formStyles.formInput}
                name="IsAdmin"
                disabled={!isEdit}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>

          {/* <div className={formStyles.formItem}>
            <label htmlFor="lastLoginDate" className={formStyles.formLabel}>
              Last Login Date
            </label>
            <input
              type="date"
              id="lastLoginDate"
              name="LastLoginDate"
              className={formStyles.formInput}
              disabled={true}
              value={inputData.LastLoginDate}
            />
          </div>{" "} */}
          {/* 
          <div className={formStyles.formRow}>
            <div className={formStyles.formItem}>
              <label htmlFor="lock-account" className={formStyles.formLabel}>
                Account Status
              </label>
              <select
                value={inputData.IsLockedOut}
                className={formStyles.formInput}
                disabled={!isEdit}
                name="IsLockedOut"
              >
                <option value={true}>Locked</option>
                <option value={false}>Active</option>
              </select>
            </div>
            <div className={formStyles.formItem}>
              <label
                htmlFor="failed-password-attempts"
                className={formStyles.formLabel}
              >
                Failed Password Attempt
              </label>
              <input
                type="number"
                id="failedPasswordAttempt"
                name="FailedPasswordAttempt"
                className={formStyles.formInput}
                value={inputData.FailedPasswordAttempt}
                disabled={!isEdit}
              />
            </div>
          </div> */}
        </form>
      </div>
    </EditContainer>
  );
}

export default AccountInfoForm;
