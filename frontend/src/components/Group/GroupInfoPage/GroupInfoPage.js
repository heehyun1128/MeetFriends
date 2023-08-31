import React from 'react'
import { NavLink } from 'react-router-dom'
import GroupInfoHead from '../GroupInfoHead/GroupInfoHead'
import GroupInfoMain from '../GroupInfoMain/GroupInfoMain'
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { fetchGroups } from '../../../store/group';
import { fetchGroupDetail } from '../../../store/group';
import './GroupInfoPage.css'

import { useParams,useHistory } from 'react-router-dom'

const GroupInfoPage = () => {

  const { groupId } = useParams()
  const history=useHistory()
  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState({})

  // get all groups
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  // get single group
  const singleGroupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))
  const groupData = singleGroupObj.groupData


  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch])

  useEffect(() => {
   
    dispatch(fetchGroupDetail(groupId))
    .catch(
      async (res) => {
     
        const data = await res.json();
        console.log(data)
        if (data && data.message) {
          setValidationError(data.message);
        }
  
      }
      )
      // history.push('/404')
  
  }, [dispatch, groupId])
  console.log(groupInfo)
  console.log(groupData)
  console.log(Object.values(validationError).length)
  if (Object.values(validationError).length){
    history.push('/404')
    
  }
  if (!groupData || !groupInfo) {
    // console.log("hit")
    return null
  }

  return (
    <>
      {groupData && groupInfo ? (<div id="group-info-div">
      <div id="group-info-head-section">
        <div className="go-back-btn">
          <i class="fa-solid fa-angle-left"></i>
          <NavLink className="go-back-btn-link" exact to="/groups">Groups</NavLink>
        </div>
        <GroupInfoHead groupData={groupData} groupInfo={groupInfo} />
        {/* <GroupInfoHead group={groupInfo} groupData={groupData} /> */}
      </div>
      <div id="group-info-main-section">
        <GroupInfoMain groupData={groupData} groupInfo={groupInfo} />
        {/* <GroupInfoMain group={groupInfo} groupData={groupData} /> */}
      </div>
    </div>):(<h1>{validationError}</h1>)
    }
    </>
   
  )
}

export default GroupInfoPage