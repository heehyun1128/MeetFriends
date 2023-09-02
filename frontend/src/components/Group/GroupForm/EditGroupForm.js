import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetail } from '../../../store/group';
import { fetchGroups } from '../../../store/group';
import GroupForm from './GroupForm';

const EditGroupForm = () => {
  const {groupId} = useParams()
  const dispatch = useDispatch();
  const history = useHistory()
  const [validationError, setValidationError] = useState({})

  // get all groups
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  // get single group
  const singleGroupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))
  const groupData=singleGroupObj.groupData
// console.log(groupData?.Organizer.id)
// check if user is logged in
const sessionUser = useSelector(state => state.session.user)
// console.log(sessionUser?.id)
  if (!sessionUser || (groupData&&sessionUser&&sessionUser.id !== groupData?.Organizer?.id)){
    history.push('/')
  }

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

  useEffect(() => {
    dispatch(fetchGroupDetail(groupId)).catch(
      async (res) => {
        const data = await res.json();
        //  console.log(data)
        if (data && data.message) {
          setValidationError(data.message);
        }

      }
    )
  }, [dispatch,groupId]);
 
  if (Object.values(validationError).length) {
    history.push('/404')

  }

  if(!Object.values(groupObj).length) return (<></>)
  // console.log(groupData)

  return (
    Object.keys(groupObj).length>0 && (
      <>
        <GroupForm
          group={groupData}
          groupInfo={groupInfo}
          formType="updateGroup"
        />
      </>
    )
  )
}

export default EditGroupForm