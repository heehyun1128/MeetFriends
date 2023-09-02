import EventForm from "./EventForm";
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
// import { fetchGroups } from "../../../store/group";
import { fetchGroupDetail } from '../../../store/group';
const CreateEventForm = () => {
  const {groupId}=useParams()
  const history = useHistory()
  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState({})



  useEffect(() => {
    dispatch(fetchGroupDetail(groupId)).catch(
      async (res) => {
        const data = await res.json();
         console.log(data)
        console.log(data.message)
        if (data && data.message) {
          setValidationError(data);
        }
       
      }
      )
    }, [dispatch, groupId]);

    
 
  if (Object.values(validationError).length ) {
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