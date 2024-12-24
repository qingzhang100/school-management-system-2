import React, { useState, useEffect } from "react";
import AnnouncementTable from "./AnnouncementTable";
import TableContainer from "../../ui/Layout/TableContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { useLoaderData, useNavigation } from "react-router-dom";
import { getAnnouncements } from "../../services/apiAnnouncements";
import Loader from "../../ui/Loader";
import { useNavigate } from "react-router-dom";
import useCheckbox from "../../hooks/useCheckbox";
import { deleteAnnouncements } from "../../services/apiAnnouncements";
import { getUnreadAnnouncementsCount } from "../../services/apiAnnouncements";
import { useUnreadCount } from "../../contexts/UnreadContext";

function Announcements() {
  const [announcementData, setAnnouncementData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const userNo = localStorage.getItem("loginUserNo");
        const data = await getAnnouncements(userNo);
        setAnnouncementData(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const {
    selectedCheckboxes,
    handleCheckboxes,
    isAllSelected,
    handleSelectAll,
  } = useCheckbox();

  const totalPages = Math.ceil(announcementData.length / rowsPerPage);

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  function handleAddBtn() {
    navigate("/dashboard/announcements/new-announcement");
  }

  async function handleBulkDelete() {
    const selectedIds = selectedCheckboxes;

    if (selectedIds.length === 0) {
      alert("Please select at least one announcement to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected announcements?"
    );

    if (confirmDelete) {
      try {
        await deleteAnnouncements(selectedIds);
        setAnnouncementData((prevData) =>
          prevData.filter(
            (announcement) => !selectedIds.includes(announcement.Id)
          )
        );
        alert("Selected announcements deleted successfully.");

        const userNo = localStorage.getItem("loginUserNo");
        const unreadCount = await getUnreadAnnouncementsCount(userNo);
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Failed to delete announcements:", error);
        alert("Failed to delete selected announcements.");
      }
    }
  }

  return (
    <>
      <MainTitle title="Announcements" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onClickAddBtn={(role === "Admin" || role === "Advisor") && handleAddBtn}
        onClickBulkDeleteBtn={
          (role === "Admin" || role === "Advisor") && handleBulkDelete
        }
      >
        {isLoading ? (
          <Loader />
        ) : (
          <AnnouncementTable
            announcementData={announcementData}
            rowsPerPage={rowsPerPage}
            currPage={currPage}
            isAllSelected={isAllSelected}
            handleSelectAll={handleSelectAll}
            selectedCheckboxes={selectedCheckboxes}
            handleCheckboxes={handleCheckboxes}
          />
        )}
      </TableContainer>
    </>
  );
}

export default Announcements;
