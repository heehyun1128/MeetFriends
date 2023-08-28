import React from 'react'
import { useHistory } from 'react-router-dom'
import './EventCard.css'


// import { useParams } from 'react-router-dom'
const EventCard = ({ event }) => {
  // const {groupId} = useParams()

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
          <h4 id='date-time'>{event && `${date} ${time}`}</h4>
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