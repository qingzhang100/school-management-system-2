import React from "react";
import styles from "./HelpAndSupport.module.css";
import EditContainer from "../../ui/Layout/EditContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";

// If time permits, add this module and allow admin to edit
const HelpAndSupport = () => {
  return (
    <>
      <MainTitle title="Help and Support" />
      <div className={styles.helpAndSupportLayout}>
        <div className={styles.mainColumn}>
          <EditContainer title="FAQ" showEditButton={false}>
            <p>
              <strong>Q: How can I reset my password?</strong>
            </p>
            <p>
              A: You can reset your password by clicking on the "Reset Password"
              link on My Account page.
            </p>
            <br />
            <p>
              <strong>
                Q: What should I do if I encounter a technical issue?
              </strong>
            </p>
            <p>
              A: Please contact our Technical Support at tech@abc-learn.edu or
              call (416) 666-0000 for assistance.
            </p>
          </EditContainer>
        </div>

        <div className={styles.secondaryColumn}>
          <EditContainer title="Main Office Contact" showEditButton={false}>
            <p>
              For inquiries related to enrolled students, including class
              adjustments, withdrawals, and general support:
            </p>
            <br />
            <p>Address: 123 Learning Avenue, Education City, XYZ 45678 </p>
            <p>Phone: (123) 456-7890 </p>
            <p>Email: info@abc-learn.edu</p>
            <p>Website: www.abc-learn.edu</p>
            <br />
            <p> General Office Hours</p>
            Monday to Friday: 8:00 AM - 4:00 PM <br />
            Saturday & Sunday: Closed
          </EditContainer>
          <EditContainer
            title="Admission Office Contact"
            showEditButton={false}
          >
            <p>
              For all admissions-related inquiries, including application and
              enrollment procedures:
            </p>
            <p>Phone: (123) 456-7890 </p>
            <p>Email: admissions@abc-learn.edu</p>
          </EditContainer>
          <EditContainer
            title="Technical Support / IT Helpdesk"
            showEditButton={false}
          >
            <p>
              For issues related to school system or technical difficulties:
            </p>
            <p>Phone: (416) 666-0000 </p>
            <p>Email: tech@abc-learn.edu</p>
            <p>Website: www.abc-learn.edu</p>
            <br />
          </EditContainer>
        </div>
      </div>
    </>
  );
};

export default HelpAndSupport;
