import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { fetchGroups } from '../../../store/group';
import GroupDetail from '../GroupDetail/GroupDetail';
import './GroupContent.css'

const GroupContent = () => {
  const groupObj = useSelector((state) => (state.groups.allGroups ? state.groups.allGroups : []))

  const groups = Object.values(
    groupObj
  );
  // console.log(groups)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

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