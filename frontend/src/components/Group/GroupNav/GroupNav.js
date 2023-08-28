import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './GroupNav.css'

const GroupNav = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div id="group-nav">
      <div id="header-title-div">
        <div id='group-head-nav-link-div'>
          {currentPath === '/events' ? (<h3 className='group-head-text'>Events</h3>) : (<NavLink className='group-head-links' exact to='/events'>Events</NavLink>)}
        </div>
        <div className='group-head-nav-link-div'>
          {currentPath === '/groups' ? (<h3 className='group-head-text'>Groups</h3>) : (<NavLink className='group-head-links' exact to='/groups'>Groups</NavLink>)}
        </div>
        
        
      </div>
      <p id="header-subtitle">
        {currentPath === '/groups' ? "Groups In MeetFriends" :"Events In MeetFriends"}
      </p>
    </div>
  )
}

export default GroupNav