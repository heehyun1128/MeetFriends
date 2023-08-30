import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetail } from '../../../store/group';
import { fetchGroups } from '../../../store/group';
import GroupForm from './GroupForm';

const EditGroupForm = () => {
  const {groupId} = useParams()
  const groupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))

  const groupData=groupObj.groupData
  // console.log(groupObj.GroupImages)
  console.log(groupData)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroupDetail(groupId));
  }, [dispatch,groupId]);
 
  if(!Object.values(groupObj).length) return (<></>)


  return (
    Object.keys(groupObj).length>0 && (
      <>
        <GroupForm
          group={groupData}
          formType="updateGroup"
        />
      </>
    )
  )
}

export default EditGroupForm