import styles from "./MyAccount.module.css";
import PersonalInfoForm from "../../components/Form/PersonalInfoForm";
import AccountInfoForm from "../../components/Form/AccountInfoForm";
import SecurityInfoForm from "../../components/Form/SecurityInfoForm";
import { useUser } from "../../contexts/UserContext";
import MainTitle from "../../ui/MainTitle/MainTitle";
function MyAccount() {
  const { userNo } = useUser();
  return (
    <>
      <MainTitle title="My Account" />
      <div className={styles.myAccountLayout}>
        <PersonalInfoForm userNo={userNo} showDeleteButton={false} />
        <SecurityInfoForm userNo={userNo} />
        <AccountInfoForm userNo={userNo} />
      </div>
    </>
  );
}

export default MyAccount;
