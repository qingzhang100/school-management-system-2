import { useState, useEffect } from "react";
import { NavLink, Link, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./SidebarNew.module.css";
import logo from "../../assets/logo-removebg-preview.png";
import Search from "../Search/Search";
import icons from "../../ui/Icons/icons";
import { getUserByID } from "../../services/apiUser";
import supabase from "../../config/supabaseClient";

function SidebarNew() {
  const routes = useLoaderData();
  const naviagate = useNavigate();

  const menuItemWithChildren = routes.find((route) => route.children);

  const menuItems = menuItemWithChildren
    ? menuItemWithChildren.children.filter((e) => e.path !== "*")
    : [];

  const [openMenus, setOpenMenus] = useState({
    dashboard: true,
    users: true,
    "my courses": true,
    "my grades": true,
    students: true,
    courses: true,
    teachers: true,
    "course category": true,
    enrollments: true,
    "my calendar": true,
  });

  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setLoginRole(storedRole);
  }, []);

  const filteredMenuItems = menuItems.filter((menuObj) => {
    if (loginRole === "Admin") {
      return (
        !(menuObj.title === "My Grades") && !(menuObj.title === "My Courses")
      );
    } else if (loginRole === "Advisor") {
      return (
        menuObj.title === "Dashboard" ||
        menuObj.title === "Students" ||
        menuObj.title === "Courses" ||
        menuObj.title === "Teachers" ||
        menuObj.title === "Course Category" ||
        menuObj.title === "Enrollments"
      );
    } else if (loginRole === "Teacher") {
      return (
        menuObj.title === "Dashboard" ||
        menuObj.title === "My Courses" ||
        menuObj.title === "My Calendar" ||
        menuObj.title === "My Grades" 
      );
    } else if (loginRole === "Student") {
      return (
        menuObj.title === "Dashboard" ||
        menuObj.title === "My Courses" ||
        menuObj.title === "My Grades" ||
        menuObj.title === "My Calendar"
      );
    }
    return false;
  });

  const searchMenuItems = filteredMenuItems
    .flatMap((item) => item.children)
    .filter((e) => !e.index);

  function toggleMenu(menuName) {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  }

  const expandAll = () => {
    const expandedState = Object.keys(openMenus).reduce((acc, menu) => {
      acc[menu] = true;
      return acc;
    }, {});
    setOpenMenus(expandedState);
  };

  const collapseAll = () => {
    const collapsedState = Object.keys(openMenus).reduce((acc, menu) => {
      acc[menu] = false;
      return acc;
    }, {});
    setOpenMenus(collapsedState);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className={styles.sidebar}>
        <Link to="/dashboard" className={styles.logoLink}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" className={styles.logoImage} />
          </div>
        </Link>

        {/* Search bar in the sidebar */}
        {/* <Search searchMenuItems={searchMenuItems} colorType="dark" menuSearch /> */}

        <div className={styles.menu}>
          {/* Buttons for Expand All / Collapse All */}

          <div className={styles.expandCollapseButtons}>
            <button onClick={expandAll} className={styles.expandCollapseButton}>
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className={styles.expandCollapseButton}
            >
              Collapse All
            </button>
          </div>
          {filteredMenuItems.map((item) => (
            <div key={item.title}>
              <div
                className={styles.menuTitle}
                onClick={() => toggleMenu(item.title.toLowerCase())}
              >
                <div className={styles.menuText}>
                  {item.icon()}
                  {item.title}
                </div>
                {openMenus[item.title.toLowerCase()]
                  ? icons.MinusIcon()
                  : icons.PlusIcon()}
              </div>
              <div
                className={`${styles.menuContent} ${
                  openMenus[item.title.toLowerCase()] ? styles.open : ""
                }`}
              >
                {item.children
                  .filter((subItem) => subItem.hideInSidebar !== true)
                  .filter((subItem) => !subItem.index)
                  .map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) =>
                        isActive
                          ? `${styles.menuItem} ${styles.current}`
                          : styles.menuItem
                      }
                    >
                      <div className={styles.menuText}>
                        {icons.CircleIcon(styles.icon)}
                        {subItem.title}
                      </div>
                    </NavLink>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <Link to={"/"} onClick={handleLogout} className={styles.logout}>
          {icons.LogoutIcon}
          <span>Logout</span>
        </Link>
      </div>
    </>
  );
}

export default SidebarNew;
