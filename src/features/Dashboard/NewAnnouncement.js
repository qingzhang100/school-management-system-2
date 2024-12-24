import MainTitle from "../../ui/MainTitle/MainTitle";
import NewAnnouncementForm from "../../components/Form/NewAnnouncementForm";

function NewAnnouncement() {
  return (
    <div>
      <MainTitle title="New Announcement" goBack={true} />
      <NewAnnouncementForm />
    </div>
  );
}

export default NewAnnouncement;
