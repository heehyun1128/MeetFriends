import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {  useHistory } from 'react-router-dom'
import GroupNav from '../Group/GroupNav/GroupNav'
import EventList from './EventList/EventList'
import { fetchEvents } from '../../store/event';
import './EventList/EventList.css'

const Event = () => {
  // const [validationError, setValidationError] = useState({})

  const eventObj = useSelector((state) => (state.events.allEvents ? state.events.allEvents : {}))

  const events = Object.values(
    eventObj
  );

  const dispatch = useDispatch();
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchEvents())
    // .catch(
    //   async (res) => {
        
    //     const data = await res.json();
    //     if (data && data.errors) {
    //       setValidationError(data.errors);
    //     }

    //   }
    // )
  }, [dispatch])

  if (!eventObj || !events) {
    // history.push('/404')
    return null
  }

  return (
    <>
      <GroupNav />
      <div id='centered-event-list'><EventList events={events} /></div>
    </>
  )
}

export default Event