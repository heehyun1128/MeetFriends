import EventForm from "./EventForm";
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
// import { fetchGroups } from "../../../store/group";
import { fetchGroupDetail } from '../../../store/group';
const CreateEventForm = () => {
  const {groupId}=useParams()
  const history = useHistory()
  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState({})


  // get single group
  const singleGroupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))
  const groupData = singleGroupObj?.groupData

  const sessionUser = useSelector(state => state.session.user)
  if (!sessionUser || (groupData && sessionUser && sessionUser.id !== groupData?.Organizer?.id)) {
    history.push('/')
  }

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
    <>
      {sessionUser && sessionUser.id === groupData?.Organizer?.id && <EventForm
        event={event}
        formType="createEvent"
      />}
    </>
  )
}

export default CreateEventForm