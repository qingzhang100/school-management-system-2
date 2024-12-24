import styles from "./Layout.module.css";
import SidebarNew from "../../components/Sidebar/SidebarNew";
import { RiMegaphoneLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultAvatar from "../../assets/User-avatar-default.jpg";
import logo from "../../assets/logo.png";
import icons from "../../ui/Icons/icons";
import supabase from "../../config/supabaseClient";

import {
  getRoleNameByNo,
  getFullNameByNo,
  getAvatarUrlByUserNo,
} from "../../services/apiUser";
import { useUnreadCount } from "../../contexts/UnreadContext";

function Layout({ children, breadcrumb, userNo }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [roleName, setRoleName] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(DefaultAvatar);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const { unreadCount } = useUnreadCount();

  const toggleMenu = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  // Close the menu when clicking elsewhere on the page
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  // Get role name
  useEffect(() => {
    const getRoleName = async () => {
      try {
        const role = await getRoleNameByNo(userNo);
        setRoleName(role);
      } catch (error) {
        console.error("Error fetching role name:", error);
      }
    };
    getRoleName();
  }, [userNo]);

  // Get full name
  useEffect(() => {
    const getFullName = async () => {
      try {
        const role = await getFullNameByNo(userNo);
        setFullName(role);
      } catch (error) {
        console.error("Error fetching full name:", error);
      }
    };

    getFullName();
  }, [userNo]);

  //  Get Avatar
  useEffect(() => {
    async function fetchAvatarUrl() {
      try {
        const avatar = await getAvatarUrlByUserNo(userNo);

        if (!avatar || avatar.trim() === "") {
          setAvatarUrl(DefaultAvatar);
        } else {
          setAvatarUrl(avatar);
        }
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
      }
    }
    fetchAvatarUrl();
  }, [userNo]);

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <main className={styles.layout}>
      <aside className={showSidebar ? styles.showSidebar : styles.hideSidebar}>
        <SidebarNew />
        <div className={styles.closeButton} onClick={toggleSidebar}>
          &times;
        </div>
      </aside>

      <section>
        {/* ================= The top section ===============*/}
        <div className={styles.mobileHeader}></div>
        <div className={styles.header}>
          {/* <div className={styles.simpleLogoContainer}>
            <img src={logo} alt="logo" className={styles.simpleLogoImage} />
          </div> */}

          <div className={styles.burgerIcon} onClick={toggleSidebar}>
            {icons.BurgerIcon()}
          </div>

          <div className={styles.breadcrumb}>{breadcrumb}</div>

          <div className={styles["user-section"]}>
            <div
              className={styles.announcement}
              onClick={() => navigate("/dashboard/announcements")}
            >
              <div className={styles["announcement-icon"]}>
                <RiMegaphoneLine
                  style={{ fill: "#333333", width: "3rem", height: "2.5rem" }}
                />
              </div>
              <div className={styles["announcement-icon-mobile"]}>
                <RiMegaphoneLine
                  style={{ fill: "#333333", width: "3rem", height: "2.5rem" }}
                />
              </div>
              <div className={styles["announcement-count"]}>{unreadCount}</div>
            </div>

            <div className={styles.nameRole}>
              <div className={styles.name}>{fullName}</div>
              <div className={styles.role}>{roleName}</div>
            </div>

            <div className={styles["user-avatar-container"]} ref={menuRef}>
              <div className={styles["user-avatar"]} onClick={toggleMenu}>
                <img src={avatarUrl || DefaultAvatar} alt="avatar" />
              </div>
              {/* dropdown menu */}
              {isOpen && (
                <div className={styles["dropdown-menu"]}>
                  <p>{fullName}</p>
                  <ul>
                    <Link
                      to="/dashboard/my-account"
                      onClick={handleMenuItemClick}
                    >
                      <li>My Account</li>
                    </Link>
                    <Link to="/" onClick={handleLogout}>
                      <li>Sign Out</li>
                    </Link>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================== The main content ================*/}
        <div className={styles.mainContent}>{children}</div>
      </section>
    </main>
  );
}

export default Layout;
