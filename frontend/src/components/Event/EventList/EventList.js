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
  // console.log("not-sort",events)
 
  // upcoming events
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date())
  
  upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  
  // past events
  const pastEvents = events.filter(event => new Date(event.startDate) < new Date())
  pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  events = upcomingEvents.concat(pastEvents)
  
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