import generalStyles from "../../generalStyles.module.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

function EditContainer({
  children,
  title,
  editButtonText,
  isEdit = false,
  onClickEdit,
  onClickSave,
  onClickCancel,
  onClickDelete,
  bgColor = "white",
}) {
  return (
    <div className={`${generalStyles.container} ${generalStyles[bgColor]}`}>
      <div className={generalStyles.containerHeader}>
        {title && <div className={generalStyles.containerHeading}>{title}</div>}
        {editButtonText && (
          <div className={generalStyles.editContainerButtons}>
            {isEdit ? (
              <>
                <Button onClickBtn={onClickSave} size="small">
                  Save
                </Button>
                <span>
                  <Button onClickBtn={onClickCancel} size="small">
                    Cancel
                  </Button>
                </span>
              </>
            ) : (
              <Button onClickBtn={onClickEdit} size="small">
                {editButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
      <div>{children}</div>
      {onClickDelete && (
        <div className={generalStyles.deleteLink}>
          <Link
            onClick={onClickDelete}
            className={generalStyles.link}
            color="blue"
          >
            Delete
          </Link>
        </div>
      )}
    </div>
  );
}

export default EditContainer;
