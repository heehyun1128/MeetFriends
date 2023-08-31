import EventForm from "./EventForm";

const CreateEventForm = () => {
  const event = {
    city: '',
    state: '',
    name: '',
    about: '',
    type: '',
    private: '',
    imageUrl: ''
  }
  return (
    <EventForm
      event={event}
      formType="createEvent"
    />
  )
}

export default CreateEventForm