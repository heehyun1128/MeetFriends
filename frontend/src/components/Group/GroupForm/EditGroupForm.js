import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetail } from '../../../store/group';
import { fetchGroups } from '../../../store/group';
import GroupForm from './GroupForm';

const EditGroupForm = () => {
  const {groupId} = useParams()
  const dispatch = useDispatch();

  // get all groups
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  // get single group
  const singleGroupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))
  const groupData=singleGroupObj.groupData


  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchGroupDetail(groupId));
  }, [dispatch,groupId]);
 
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