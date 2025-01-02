import React, { useState } from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-removebg-preview.png";
import { useUnreadCount } from "../../contexts/UnreadContext";
import { useUser } from "../../contexts/UserContext";
import ForgotPassword from "./ForgotPassword";
import { getUnreadAnnouncementsCount } from "../../services/apiAnnouncements";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { setUserNo } = useUser();
  const { setUnreadCount } = useUnreadCount();

  // REVERT to no supabase authentication, do not change
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const { data, error } = await supabase
  //     .from("Users")
  //     .select(
  //       `
  //       UserID,
  //       UserNo,
  //       UserName,
  //       FirstName,
  //       LastName,
  //       PasswordHash,
  //       Roles (RoleName)
  //     `
  //     )
  //     .eq("UserName", username)
  //     .eq("PasswordHash", password)
  //     .single();

  //   if (error || !data) {
  //     alert("Invalid Username or Password");
  //     return;
  //   }

  //   const userRole = data.Roles.RoleName;
  //   localStorage.setItem("UserID", data.UserID);
  //   localStorage.setItem("role", userRole);

  //   setUserNo(data.UserNo);

  //   try {
  //     const unreadCount = await getUnreadAnnouncementsCount(data.UserNo);
  //     setUnreadCount(unreadCount);
  //   } catch (err) {
  //     console.error("Failed to fetch unread announcements:", err);
  //   }

  //   navigate("/dashboard", { replace: true });
  // };

  async function handleLoginAsAdmin() {
    localStorage.setItem("role", "Admin");
    localStorage.setItem("UserID", "0c065285-63aa-475b-9e9b-229daf7e00c8");
    setUserNo("45");

    try {
      const unreadCount = await getUnreadAnnouncementsCount("45");
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread announcements:", err);
    }

    navigate("/dashboard");
  }

  async function handleLoginAsAdvisor() {
    localStorage.setItem("role", "Advisor");
    localStorage.setItem("UserID", "05548efa-c8cc-464e-b6c9-777a2243a981");
    setUserNo("35");

    try {
      const unreadCount = await getUnreadAnnouncementsCount("35");
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread announcements:", err);
    }

    navigate("/dashboard");
  }

  async function handleLoginAsTeacher() {
    localStorage.setItem("role", "Teacher");
    localStorage.setItem("UserID", "5cafdca7-4bcf-4505-a488-0431d42a58a7");

    setUserNo("22");

    try {
      const unreadCount = await getUnreadAnnouncementsCount("22");
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread announcements:", err);
    }

    navigate("/dashboard");
  }

  async function handleLoginAsStudent() {
    localStorage.setItem("role", "Student");
    localStorage.setItem("UserID", "f3ed59fd-f8fe-4753-91f9-bbf9ed183de6");

    setUserNo("2");

    try {
      const unreadCount = await getUnreadAnnouncementsCount("2");
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread announcements:", err);
    }

    navigate("/dashboard");
  }

  return (
    <main className={styles.homepage}>
      <div className={styles.bg}></div>

      <div className={styles.loginAndForgotPassword}>
        <section
          className={`${styles.loginSection} ${
            showForgotPassword ? styles.moveLeft : ""
          }`}
        >
          <p style={{ width: "50%", fontWeight: "800" }}>
            This is a simulation login page. Click any button below to log in as
            a specific role. Each button represents a different user role,
            allowing you to explore the application as an Admin, Advisor,
            Teacher, or Student. No real credentials are required.
          </p>
          <br />
          <form className={styles.loginForm}>
            <div className={styles.loginFormItem}>
              <Button size="large" onClickBtn={handleLoginAsAdmin}>
                Login as Admin
              </Button>
            </div>
            <div className={styles.loginFormItem}>
              <Button size="large" onClickBtn={handleLoginAsAdvisor}>
                Login as Advisor
              </Button>
            </div>
            <div className={styles.loginFormItem}>
              <Button size="large" onClickBtn={handleLoginAsTeacher}>
                Login as Teacher
              </Button>
            </div>

            <div className={styles.loginFormItem}>
              <Button size="large" onClickBtn={handleLoginAsStudent}>
                Login as Student
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;
