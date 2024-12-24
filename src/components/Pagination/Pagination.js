import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ totalPages, currPage, onPageChange }) => {
  function handlePageClick(page) {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  }

  return (
    <nav className={styles.pagination} aria-label="Staff list pagination">
      <button
        className={`${styles.pageButton} ${styles.beforeButton}`}
        onClick={() => handlePageClick(currPage - 1)}
        disabled={currPage === 1}
      >
        &lt;&lt;
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={`page_${index + 1}`}
          className={`${styles.pageButton} ${
            currPage === index + 1 ? styles.active : ""
          }`}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className={`${styles.pageButton} ${styles.nextButton}`}
        onClick={() => handlePageClick(currPage + 1)}
        disabled={currPage === totalPages}
      >
        &gt;&gt;
      </button>
    </nav>
  );
};

export default Pagination;
