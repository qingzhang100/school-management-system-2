import React from "react";
import generalStyles from "../../generalStyles.module.css";
import styles from "./TableContainer.module.css";
import Pagination from "../../components/Pagination/Pagination";
import Button from "../../components/Button/Button";
import Search from "../../components/Search/Search";
import SelectButton from "../../components/Button/SelectButton";

function TableContainer({
  children,
  title,
  rowsPerPage,
  totalPages,
  currPage,
  onPageChange,
  onRowsPerPageChange,
  onClickAddBtn,
  onClickEditBtn,
  onClickBulkDeleteBtn,
  itemsNums = [5, 10, 15, 20, 25, 30],
  sortOptions,
  onClickSort,
  filterOptions,
  onClickFilter,
  onSearch,
}) {
  return (
    <div className={generalStyles.container}>
      {title && (
        <div className={generalStyles.containerHeader}>
          <div className={generalStyles.containerHeading}>
            <span>{title}&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      )}
      <div className={styles.tableFeatures}>
        <div className={styles.tableFeaturesLeftBox}>
          {onClickAddBtn && (
            <Button onClickBtn={onClickAddBtn} size="large">
              Create New
            </Button>
          )}
          {onClickEditBtn && (
            <Button onClickEditBtn={onClickEditBtn} size="large">
              Bulk Edit
            </Button>
          )}
          {onClickBulkDeleteBtn && (
            <Button
              size="large"
              color="blue"
              onClickEditBtn={onClickBulkDeleteBtn}
            >
              Bulk Delete
            </Button>
          )}
          {sortOptions && (
            <div>
              <SelectButton
                options={sortOptions}
                onSelect={onClickSort}
                size="large"
                label="Sort By"
              />
            </div>
          )}
          {filterOptions && (
            <div>
              <SelectButton
                options={filterOptions}
                size="large"
                onSelect={onClickFilter}
                label="Filter By"
              />
            </div>
          )}

          {/* ========= Search Bar ========== */}
          {onSearch && <Search colorType="light" onSearch={onSearch} />}
          {/* =============================== */}
        </div>
        <div className={styles.entriesPerPage}>
          <span>Showing</span>
          <select value={rowsPerPage} onChange={onRowsPerPageChange}>
            {itemsNums.map((num, index) => (
              <option value={num} key={index}>
                {num}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
      </div>

      <div>{children}</div>

      <Pagination
        totalPages={totalPages}
        currPage={currPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default TableContainer;
