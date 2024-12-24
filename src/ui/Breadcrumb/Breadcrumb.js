import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";
import generalStyles from "../../generalStyles.module.css";
import { RiHome3Line } from "@remixicon/react";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className={styles.breadcrumb}>
      <div>
        <Link to="/dashboard">
          <RiHome3Line className={styles["home-icon"]} />
        </Link>
      </div>
      <span className={styles.slash}>&nbsp;/&nbsp;</span>
      <nav>
        <ul className={styles.path}>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={to}>
                {isLast ? (
                  <span>{value}</span>
                ) : (
                  <Link
                    to={to}
                    className={generalStyles.noStyleLink}
                    style={{ textDecoration: "none" }}
                  >
                    {value}&nbsp;/&nbsp;
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Breadcrumb;
