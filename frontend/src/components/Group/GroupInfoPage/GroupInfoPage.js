import React from 'react'
import { NavLink } from 'react-router-dom'
import GroupInfoHead from '../GroupInfoHead/GroupInfoHead'
import GroupInfoMain from '../GroupInfoMain/GroupInfoMain'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchGroups } from '../../../store/group';
import { fetchGroupDetail } from '../../../store/group';
import './GroupInfoPage.css'

import { useParams } from 'react-router-dom'

const GroupInfoPage = () => {

  const { groupId } = useParams()
  const dispatch = useDispatch();
  
  // get all groups
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  // get single group
  const singleGroupObj = useSelector((state) => (Object.values(state.groups.singleGroup).length ? state.groups.singleGroup : {}))
  const groupData = singleGroupObj.groupData

  
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchGroupDetail(groupId));
  }, [dispatch, groupId]);
  
  // console.log("123456789",groupData)
  // console.log("qwertyui",groupInfo)
  // if (!Object.values(groupObj).length) return (<></>)
  return (
    <div id="group-info-div">
      <div id="group-info-head-section">
        <div className="go-back-btn">
          <i class="fa-solid fa-angle-left"></i>
          <NavLink exact to="/groups">Groups</NavLink>
        </div>
        <GroupInfoHead groupData={groupData} groupInfo={groupInfo}/>
        {/* <GroupInfoHead group={groupInfo} groupData={groupData} /> */}
      </div>
      <div id="group-info-main-section">
        <GroupInfoMain groupData={groupData} groupInfo={groupInfo }/>
        {/* <GroupInfoMain group={groupInfo} groupData={groupData} /> */}
      </div>
    </div>
  )
}

export default GroupInfoPage