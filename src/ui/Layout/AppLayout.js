import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Layout from "./Layout";

import { Link, Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

function AppLayout() {
  const { userNo } = useUser();
  
  return (
    <>
      <Layout breadcrumb={<Breadcrumb />} userNo={userNo}>
        <div>
          <Outlet />
        </div>
      </Layout>
      {/* ================= The footer ===============*/}
      <footer
        style={{
          backgroundColor: "#f9f9f9",
          padding: "1rem 0",
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#333",
          borderTop: "1px solid #ddd",
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        <p>© {new Date().getFullYear()} ABC-LEARN. All Rights Reserved.</p>
        {/* <p>
          <Link
            to="/privacy-policy"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            to="/terms-of-service"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Terms of Service
          </Link>
        </p> */}
      </footer>
    </>
  );
}

export default AppLayout;
