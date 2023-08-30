import React from 'react'
import {NavLink} from 'react-router-dom'
const EventDetail = () => {
  return (
    <div>
      <div className="go-back-btn">
        <i class="fa-solid fa-angle-left"></i>
        <NavLink exact to="/events">Events</NavLink>
      </div>
      {/* <h1>{event.name}</h1> */}
    </div>
  )
}

export default EventDetail