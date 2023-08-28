import React from 'react'
import './GroupInfoHead.css'
import { useSelector } from "react-redux";
const GroupInfoHead = ({ group }) => {
  const sessionUser = useSelector(state => state.session.user)
  const handleJoinGroup = e=>{
    e.preventDefault()
   alert("Feature coming soon...")
  }
  return (
    <div id="group-info-head-container">
      <div className="image-div">
        <img className='group-info-image' src={group && group.previewImage} alt="groupImage" />
      </div>
      <div className="group-head-right">
        <div>
          <h1>{group && group.name}</h1>
          <div className="group-info-sub-head">
            <p className='group-info-city'>{group && group.city}</p>
            <div className='event-privacy-div'>
              <p className='group-info-numEvents'>{group && group.numEvents} events</p>
              <div className="group-info-centered-dot"><p>.</p></div>
              <p className='group-info-private'>{group && group.private ? "Private" : "Public"}</p>
            </div>
            <p className="group-info-organizer">Organized By {group && group.Organizer.firstName} {group && group.Organizer.lastName}</p>
          </div>
        </div>
        {group && sessionUser.id !== group.organizerId && <button id="join-this-group-btn" onClick={handleJoinGroup}>
          Join this group
        </button>}
      </div>
    </div>

  )
}

export default GroupInfoHead