import styles from "./CourseCard.module.css";
import { RiInformationLine } from "@remixicon/react";
import { RiMapPinLine } from "@remixicon/react";
import { RiTimeLine } from "@remixicon/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CourseCard = ({
  CourseName,
  image,
  teacherName,
  instructorAvtar,
  classRoom,
  classTime,
  description,
  courseId,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleMouseEnter = () => {
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  return (
    <div className={styles["course-card"]}>
      <div className={styles["course-banner"]}>
        {" "}
        <Link to={`/my-courses/${courseId}`}>
          <img
            src="https://llcccnztkkxlkzblokbt.supabase.co/storage/v1/object/public/ProfileImage/public/bookcover1.png"
            alt="Retrieve course banner from database"
          />
        </Link>
        {/* <div className={styles["course-tag-box"]}>
          <a href="#" className={`${styles["badge-tag"]} ${styles.orange} `}>
            Business
          </a>
          <a href="#" className={`${styles["badge-tag"]} ${styles.blue} `}>
            Marketing
          </a>
        </div> */}
      </div>

      <div className={styles["course-content"]}>
        <Link>
          <h3 className={styles["card-title"]}>{CourseName}</h3>
        </Link>
        <div className={`${styles["border-bottom"]} ${styles.wrapper} `}>
          <div className={styles.location}>
            <RiMapPinLine className={styles.icon} />

            <p>ClassRoom</p>
          </div>

          <div className={styles.time}>
            <RiTimeLine className={styles.icon} />

            <p>{classTime ? classTime : "TBD"}</p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.teacher}>
            <img
              src="https://llcccnztkkxlkzblokbt.supabase.co/storage/v1/object/public/ProfileImage/living-with-cats-dogs-689902.jpg"
              alt="course instructor avatar"
              className={styles["teacher-img"]}
            />
            <a href="#home" className={styles["teacher-name"]}>
              {teacherName}
            </a>
          </div>

          <div
            className={styles.infoIcon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <RiInformationLine className={styles.icon} />
            {showInfo && (
              <div className={styles.tooltip}>
                <h3>Course Information</h3>
                <p>
                  <strong>Description:</strong> {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
