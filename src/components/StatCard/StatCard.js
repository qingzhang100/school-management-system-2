import { Link } from "react-router-dom";
import styles from "./StatCard.module.css";
import icons from "../../ui/Icons/icons";

function StatCard({ number, unit, icon, bgcolor, link }) {
  return (
    <div className={`${styles.statcard} ${styles[bgcolor]}`}>
      <div className={styles.top}>
        <div className={styles.topText}>
          <h3>{number}</h3>
          <p>{unit}</p>
        </div>
        <div>{icon}</div>
      </div>
      <div className={styles.bottom}>
        <Link to={link} className={styles.moreinfo}>
          More info {icons.ArrowRightIcon(styles.arrow)}
        </Link>
      </div>
    </div>
  );
}

export default StatCard;
