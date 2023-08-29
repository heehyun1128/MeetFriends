import React from 'react'
import { NavLink } from 'react-router-dom'
import GroupInfoHead from '../GroupInfoHead/GroupInfoHead'
import GroupInfoMain from '../GroupInfoMain/GroupInfoMain'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchGroups } from '../../../store/group';
import './GroupInfoPage.css'

import { useParams } from 'react-router-dom'

const GroupInfoPage = () => {

  const { groupId } = useParams()
  // console.log(groupId)
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))


  // console.log(groupObj)
  const groupInfo = groupObj[groupId]
  // console.log(groupInfo)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);
// console.log("11111111")

  return (
    <div id="group-info-div">
      <div id="group-info-head-section">
        <div className="go-back-btn">
          <i class="fa-solid fa-angle-left"></i>
          <NavLink exact to="/groups">Groups</NavLink>
        </div>
        <GroupInfoHead group={groupInfo} />
      </div>
      <div id="group-info-main-section">
        <GroupInfoMain group={groupInfo} />
      </div>
    </div>
  )
}

export default GroupInfoPage