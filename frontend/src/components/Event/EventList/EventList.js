import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchEvents } from '../../../store/event';
import './EventList.css'
import EventCard from '../EventCard/EventCard';


const EventList = ({events}) => {
  // console.log(events)

 
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