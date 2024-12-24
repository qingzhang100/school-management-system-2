import { useState, useEffect } from "react";
import {
  getSchoolContact,
  updateSchoolContact,
} from "../../services/apiSchool";
import Button from "../Button/Button";
import ModalContainer from "../../ui/Layout/ModalContainer";
import formStyles from "./Form.module.css";
import generalStyles from "../../generalStyles.module.css";
import EditContainer from "../../ui/Layout/EditContainer";

function ContactForm({ role }) {
  const [contactInfo, setContactInfo] = useState("");
  const [originalContactInfo, setOriginalContactInfo] = useState(""); // to store the original data
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    async function fetchSchoolInformation() {
      const data = await getSchoolContact();
      setContactInfo(data);
      setOriginalContactInfo(data);
    }
    fetchSchoolInformation();
  }, []);

  function handleChange(e) {
    setContactInfo(e.target.value);
  }

  function handleClickEdit(e) {
    e.preventDefault();
    setIsOpenModal(true);
  }

  function handleClickCancel(e) {
    e.preventDefault();
    setIsOpenModal(false);
    setContactInfo(originalContactInfo); // Reset the contact info to the original data when Cancel is clicked
  }

  async function handleClickSave(e) {
    e.preventDefault();
    try {
      await updateSchoolContact({ Contact: contactInfo });

      setIsOpenModal(false);
      setOriginalContactInfo(contactInfo); // Update original contact info after successful save
      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Error saving school data:", error);
      alert("An error occurred while saving the school data.");
    }
  }

  return (
    <div className={formStyles.contactForm}>
      <EditContainer
        title="Main Contact"
        editButtonText={role === "Admin" ? "Edit" : false}
        onClickEdit={handleClickEdit}
        onClickSave={handleClickSave}
        onClickCancel={handleClickCancel}
      >
        {isOpenModal && (
          <ModalContainer title="Edit Main Contact" onClose={handleClickCancel}>
            <textarea
              value={contactInfo}
              onChange={handleChange}
              rows={14}
              className={formStyles.formInput}
              style={{ height: "auto" }}
            />
            <div className={formStyles.bottomButtons}>
              <Button onClickBtn={handleClickSave}>Save</Button>
              <Button onClickBtn={handleClickCancel}>Cancel</Button>
            </div>
          </ModalContainer>
        )}

        <div>
          <p className={formStyles.contact}>{contactInfo}</p>
        </div>
      </EditContainer>
    </div>
  );
}

export default ContactForm;
