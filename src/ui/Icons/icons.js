import {
  RiAddLine,
  RiSubtractLine,
  RiLogoutCircleLine,
  RiCircleLine,
  RiDashboardFill,
  RiBookOpenFill,
  RiGraduationCapFill,
  RiUserAddFill,
  RiCalendarFill,
  RiDraftFill,
  RiArchiveDrawerFill,
  RiUser3Fill,
  RiSearchLine,
  RiCloseLine,
  RiArrowRightCircleLine,
  RiCheckboxCircleFill,
  RiArrowLeftCircleLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowDownSFill,
  RiMenuLine,
  RiTableFill,
} from "@remixicon/react";

const icons = {
  CheckboxCircleIcon: (className = "", style = {}) => (
    <RiCheckboxCircleFill className={className} style={style} />
  ),
  PlusIcon: (className = "", style = {}) => (
    <RiAddLine className={className} style={style} />
  ),
  MinusIcon: (className = "", style = {}) => (
    <RiSubtractLine className={className} style={style} />
  ),
  CircleIcon: (className = "", style = {}) => (
    <RiCircleLine className={className} style={style} />
  ),
  DashboardIcon: (className = "", style = {}) => (
    <RiDashboardFill className={className} style={style} />
  ),
  UserIcon: (className = "", style = {}) => (
    <RiUserAddFill className={className} style={style} />
  ),
  MyCoursesIcon: (className = "", style = {}) => (
    <RiCalendarFill className={className} style={style} />
  ),
  StudentIcon: (className = "", style = {}) => (
    <RiGraduationCapFill className={className} style={style} />
  ),
  CourseIcon: (className = "", style = {}) => (
    <RiBookOpenFill className={className} style={style} />
  ),
  ProgramIcon: (className = "", style = {}) => (
    <RiArchiveDrawerFill className={className} style={style} />
  ),
  TeacherIcon: (className = "", style = {}) => (
    <RiUser3Fill className={className} style={style} />
  ),
  EnrollmentIcon: (className = "", style = {}) => (
    <RiDraftFill className={className} style={style} />
  ),
  CalendarIcon: (className = "", style = {}) => (
    <RiTableFill className={className} style={style} />
  ),
  LogoutIcon: <RiLogoutCircleLine />,
  SearchIcon: <RiSearchLine />,
  CloseIcon: <RiCloseLine />,
  ArrowRightIcon: (className = "", style = {}) => (
    <RiArrowRightCircleLine className={className} style={style} />
  ),
  ArrowBack: (className = "", style = {}) => (
    <RiArrowLeftCircleLine className={className} style={style} />
  ),
  EyeOpen: <RiEyeLine style={{ fill: "black" }} />,
  EyeOff: <RiEyeOffLine style={{ fill: "black" }} />,
  ArrowDownIcon: (className = "", style = {}) => (
    <RiArrowDownSFill className={className} style={style} />
  ),
  BurgerIcon: (
    className = "",
    style = { fill: "#333333", width: "3rem", height: "2.5rem" }
  ) => <RiMenuLine className={className} style={style} />,
};

export default icons;
