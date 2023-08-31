import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

import './EventList.css'
import EventCard from '../EventCard/EventCard';


const EventList = ({events}) => {
  // console.log(events)
  
  const history = useHistory()
  
  if ( !events) {
    // history.push('/404')
    return null
  }
  return (
    <div id='event-list-div'>
      <ul>{events.map(event => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}</ul>
    </div>
  )
}

export default EventList