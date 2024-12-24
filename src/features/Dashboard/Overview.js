import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Overview.module.css";
import StatCard from "../../components/StatCard/StatCard";
import icons from "../../ui/Icons/icons";
import { getStudents } from "../../services/apiStudent";
import { getTeachers } from "../../services/apiTeacher";
import { getCourses } from "../../services/apiCourse";
import { getEnrollments } from "../../services/apiEnrollment";
import EditContainer from "../../ui/Layout/EditContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { getTeacherCoursesByUserID } from "../../services/apiTeacher";
import { getStudentCoursesByUserID } from "../../services/apiStudent";
import ContactForm from "../../components/Form/ContactForm";
import { getAnnouncements } from "../../services/apiAnnouncements";
import ModalContainer from "../../ui/Layout/ModalContainer";
import { addUserNoToReadBy } from "../../services/apiAnnouncements";
import { getUnreadAnnouncementsCount } from "../../services/apiAnnouncements";
import { useUnreadCount } from "../../contexts/UnreadContext";
import { Link, useNavigate } from "react-router-dom";
import generalStyles from "../../generalStyles.module.css";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridWeekPlugin from "@fullcalendar/timegrid";

function Overview() {
  const [loginRole, setLoginRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [openedAnnouncement, setOpenedAnnouncement] = useState(null);
  const { unreadCount, setUnreadCount } = useUnreadCount();

  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    setLoginRole(storedRole);
    setFirstName(storedFirstName);
    setLastName(storedLastName);
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [students, teachers, courses, enrollments] = await Promise.all([
          getStudents(),
          getTeachers(),
          getCourses(),
          getEnrollments(),
        ]);

        setStudentCount(students.length);
        setTeacherCount(teachers.length);
        setCourseCount(courses.length);
        setEnrollmentCount(enrollments.length);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    async function fetchTeacherCourses() {
      const storedUserID = localStorage.getItem("UserID");
      const storedRole = localStorage.getItem("role");
      if (storedRole === "Teacher") {
        const teachercourses = await getTeacherCoursesByUserID(storedUserID);
        setTeacherCourses(teachercourses);
      } else if (storedRole === "Student") {
        const studentcourses = await getStudentCoursesByUserID(storedUserID);
        setStudentCourses(studentcourses);
      }
    }
    fetchTeacherCourses();
  }, []);

  function renderStatCards() {
    console.log("login role", loginRole);
    if (loginRole === "Admin" || loginRole === "Advisor") {
      return (
        <>
          <StatCard
            number={studentCount}
            unit="Students"
            icon={icons.StudentIcon(styles.largeIcon)}
            bgcolor="bgcolor1"
            link="/students/student-list"
          />
          <StatCard
            number={teacherCount}
            unit="Teachers"
            icon={icons.TeacherIcon(styles.largeIcon)}
            bgcolor="bgcolor2"
            link="/teachers/teacher-list"
          />
          <StatCard
            number={courseCount}
            unit="Courses"
            icon={icons.CourseIcon(styles.largeIcon)}
            bgcolor="bgcolor3"
            link="/courses/course-list"
          />
          <StatCard
            number={enrollmentCount}
            unit="Enrollments"
            icon={icons.EnrollmentIcon(styles.largeIcon)}
            bgcolor="bgcolor4"
            link="/enrollments/enrollment-list"
          />
        </>
      );
    } else if (loginRole === "Teacher") {
      return (
        <>
          <StatCard
            number={teacherCourses.length}
            unit="My Courses"
            icon={icons.StudentIcon(styles.largeIcon)}
            bgcolor="bgcolor3"
            link="/my-courses"
          />{" "}
          <StatCard
            number={announcements.length}
            unit="Announcements"
            icon={icons.DashboardIcon(styles.largeIcon)}
            bgcolor="bgcolor1"
            link="/dashboard/announcements"
          />
        </>
      );
    } else {
      return (
        <>
          <StatCard
            number={studentCourses.length}
            unit="My Courses"
            icon={icons.StudentIcon(styles.largeIcon)}
            bgcolor="bgcolor2"
            link="/my-courses"
          />
          <StatCard
            number={announcements.length}
            unit="Announcements"
            icon={icons.DashboardIcon(styles.largeIcon)}
            bgcolor="bgcolor3"
            link="/dashboard/announcements"
          />
        </>
      );
    }
  }

  // function renderQuickLinks() {
  //   if (loginRole === "Admin") {
  //     return (
  //       <ul>
  //         <li>
  //           <Link to="/users/new-user" className={generalStyles.link}>
  //             Add New User
  //           </Link>{" "}
  //           <li>
  //             <Link to="/courses/new-course" className={generalStyles.link}>
  //               Add New Course
  //             </Link>
  //           </li>
  //         </li>
  //       </ul>
  //     );
  //   } else if (loginRole === "Advisor") {
  //     return (
  //       <ul>
  //         <li>
  //           <Link to="/courses/new-course" className={generalStyles.link}>
  //             Add New Course
  //           </Link>
  //         </li>
  //       </ul>
  //     );
  //   } else if (loginRole === "Teacher" || loginRole === "Student") {
  //     return (
  //       <ul>
  //         <li>
  //           <Link to="/my-courses/my-courses" className={generalStyles.link}>
  //             My Courses
  //           </Link>
  //         </li>
  //         <li>
  //           <Link to="/my-calendar/my-calendar" className={generalStyles.link}>
  //             My Calendar
  //           </Link>
  //         </li>
  //       </ul>
  //     );
  //   }
  // }

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching announcements", error);
      }
    }

    fetchAnnouncements();
  }, []);

  async function handleClickAnnouncement(announcement) {
    setOpenedAnnouncement(announcement);

    const userNo = localStorage.getItem("loginUserNo");
    if (!userNo) {
      console.error("UserNo is not available.");
      return;
    }

    try {
      const success = await addUserNoToReadBy(announcement.Id, userNo);
      if (success) {
        const count = await getUnreadAnnouncementsCount(userNo);
        setUnreadCount(count);
      }
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  }

  function renderAnnouncements() {
    return (
      <>
        <div className={styles.announcementsContainer}>
          {announcements.map((announcement) => {
            const maxLength = 250;
            return (
              <div
                key={announcement.Id}
                className={styles.announcementItem}
                onClick={() => handleClickAnnouncement(announcement)}
              >
                <h4 className={styles.announcementTitle}>
                  {announcement.Title}
                </h4>
                <p className={styles.announcementContent}>
                  {announcement.Content.length > maxLength ? (
                    <>
                      {announcement.Content.substring(0, maxLength)}...
                      &nbsp;&nbsp;
                      <span className={styles.readMore}>Read more</span>
                    </>
                  ) : (
                    announcement.Content
                  )}
                </p>

                <span className={styles.announcementDate}>
                  {new Date(announcement.CreatedAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <MainTitle title="Overview" />
      {/* ============== Stat Card ================ */}
      <div className={styles.statcards}>{renderStatCards()}</div>
      <div className={styles.overviewLayout}>
        <div className={styles.mainColumn}>
          {/* ============= Announcements ============ */}
          <EditContainer
            title={
              <>
                Announcements&nbsp;&nbsp;
                <Link
                  to="/dashboard/announcements"
                  className={generalStyles.link}
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "500",
                    textDecoration: "none",
                  }}
                >
                  (View all)
                </Link>
              </>
            }
          >
            {renderAnnouncements()}
          </EditContainer>
          {/* Only show Modal if there's an active announcement */}
          {openedAnnouncement && (
            <ModalContainer
              title={openedAnnouncement.Title}
              onClose={() => setOpenedAnnouncement(null)}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {openedAnnouncement.Content}
              </pre>
            </ModalContainer>
          )}
        </div>

        <div className={styles.secondaryColumn}>
          <EditContainer
            bgColor="highlight"
            title={formattedDate}
            onClickEdit={() => {
              navigate("/my-calendar");
            }}
            editButtonText="Full Calendar"
          >
            <Calendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridWeekPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "",
                right: "",
              }}
              contentHeight="auto"
            />
          </EditContainer>
          <ContactForm role={loginRole} />
        </div>
      </div>
    </>
  );
}

export default Overview;
