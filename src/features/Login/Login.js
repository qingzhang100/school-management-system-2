import React, { useState } from "react";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useUnreadCount } from "../../contexts/UnreadContext";
import { useUser } from "../../contexts/UserContext";
import { getUnreadAnnouncementsCount } from "../../services/apiAnnouncements";

function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { setUserNo } = useUser();
  const { setUnreadCount } = useUnreadCount();

  async function handleLoginAsAdmin() {
    localStorage.setItem("role", "Admin");
    localStorage.setItem("UserID", "0c065285-63aa-475b-9e9b-229daf7e00c8");
    setUserNo(45);

    navigate("/dashboard");
  }

  async function handleLoginAsAdvisor() {
    localStorage.setItem("role", "Advisor");
    localStorage.setItem("UserID", "05548efa-c8cc-464e-b6c9-777a2243a981");
    setUserNo("35");

    navigate("/dashboard");
  }

  async function handleLoginAsTeacher() {
    localStorage.setItem("role", "Teacher");
    localStorage.setItem("UserID", "5cafdca7-4bcf-4505-a488-0431d42a58a7");

    setUserNo("22");
    navigate("/dashboard");
  }

  async function handleLoginAsStudent() {
    localStorage.setItem("role", "Student");
    localStorage.setItem("UserID", "f3ed59fd-f8fe-4753-91f9-bbf9ed183de6");

    setUserNo("2");

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
