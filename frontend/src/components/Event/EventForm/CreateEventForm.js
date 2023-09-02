import EventForm from "./EventForm";
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from "../../../store/group";
const CreateEventForm = () => {
  const {groupId}=useParams()
  const history = useHistory()
  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState({})

  // get all groups
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  useEffect(() => {
    dispatch(fetchGroups()).catch(
      async (res) => {
        const data = await res.json();
        //  console.log(data)
        if (data && data.message) {
          setValidationError(data.message);
        }

      }
    )
  }, [dispatch]);
 
  if (Object.values(validationError).length) {
    history.push('/404')

  }
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