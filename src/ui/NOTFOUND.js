import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import styles from "./NOTFOUND.module.css";
function NOTFOUND() {
  const navigate = useNavigate();
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.largeIcon}>😰</div>
        <br />
        <h1>Oops! Page Not Found</h1>
        <br />
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <div className={styles.bottomButtons}>
          <Button onClickBtn={() => navigate(-1)}>Back</Button>
          <Button onClickBtn={() => navigate("/dashboard/overview")}>
            Go to overview
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NOTFOUND;
