import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { fetchGroups } from '../../../store/group';
import GroupDetail from '../GroupDetail/GroupDetail';
import './GroupContent.css'

const GroupContent = () => {
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
useSelector(state=>console.log("state 123",state))
  const groups = Object.values(
    groupObj
  );
  console.log("get all groups", groups)
  // sort group - recently created group at the top
  groups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (!Object.values(groupObj).length) {
    return null
  }

  // const groups = useSelector(state=>state.allGroups)
  return (
    <section id='group-content'>
      <ul>{groups.map(group => (
        <GroupDetail
          key={group.id}
          group={group}
        />
      ))}</ul>
    </section>
  )
}

export default GroupContent