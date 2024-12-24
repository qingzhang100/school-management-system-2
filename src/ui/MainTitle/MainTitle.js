import styles from "./MainTitle.module.css";
import icons from "../Icons/icons";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

function MainTitle({ title, goBack }) {
  const navigate = useNavigate();
  return (
    <div className={styles.mainTitle}>
      {goBack && (
        <div className={styles.back} onClick={() => navigate(-1)}>
          {icons.ArrowBack(styles.arrowBack)}
        </div>
      )}

      <div>{title}</div>
      <div className={styles.separator} />
    </div>
  );
}

export default MainTitle;
