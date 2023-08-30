import React from 'react'
import { useHistory } from 'react-router-dom'
import './EventCard.css'


const EventCard = ({ event }) => {


  const date = event.startDate.split('T')[0]
  const time = event.startDate.split('T')[1].slice(0, 8)

  const history = useHistory()
  const handleViewEventDetails = e => {
    e.preventDefault()
    history.push(`/events/${event.id}`)
  }
  return (
    <div id='event-card-container' onClick={handleViewEventDetails}>
      <div className="event-card-upper">
        {event.previewImage ? (<img className='event-image-preview' src={event && event.previewImage} alt="EventImage" />) : (<div className='event-image-preview'>No Event Image</div>)}
        <div className="event-card-upper-right">
          <div id='event-card-date-time'>
            {event && <h4 id='date-time'>{date}</h4>}
            {event && <h4 id='event-card-dot'><p>.</p></h4>}
            {event && <h4 id='date-time'>{time}</h4>}
         </div>
          <h3>{event && event.name}</h3>
          <p id='event-city'>{event && event.Venue ? event.Venue.city : "Online"}</p>
        </div>
      </div>
      <div className="event-card-lower">
        {event && event.description}
      </div>

    </div>
  )
}

export default EventCard