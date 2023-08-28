import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import GroupNav from '../Group/GroupNav/GroupNav'
import EventList from './EventList/EventList'
import { fetchEvents } from '../../store/event';


const Event = () => {

  const eventObj = useSelector((state) => (state.events.allEvents ? state.events.allEvents : []))

  const events = Object.values(
    eventObj
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  

  return (
    <>
      <GroupNav />
      <EventList events={events}/>
    </>
  )
}

export default Event