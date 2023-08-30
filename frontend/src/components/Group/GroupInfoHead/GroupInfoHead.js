import React from 'react'
import './GroupInfoHead.css'
import { useSelector } from "react-redux";
import {useHistory,useParams} from 'react-router-dom'
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import DeleteModal from '../../DeleteModal/DeleteModal';


const GroupInfoHead = ({ group,groupData }) => {
  const sessionUser = useSelector(state => state.session.user)
  const handleJoinGroup = e => {
    e.preventDefault()
    alert("Feature coming soon...")
  }

  const history = useHistory()
  const {groupId} = useParams()
  const handleCreateEvent = e => {
    e.preventDefault()
    history.push('/events/new')
  }
  const handleUpdateEvent = e => {
    e.preventDefault()
    history.push(`/groups/${groupId}/edit`)
  }
  console.log(group)
  // console.log(groupData.GroupImages.find(image => image.preview === true))

  return (
    <div id="group-info-head-container">
      <div className="image-div">
        <img className='group-info-image' src={groupData && groupData.GroupImages && groupData.GroupImages.find(image=>image.preview===true).url} alt="groupImage" />
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
            <p className="group-info-organizer">Organized By {group && group.organizer.firstName} {group && group.organizer.lastName}</p>
          </div>
        </div>
        {group && sessionUser && sessionUser.id !== group.organizerId && <button id="join-this-group-btn" onClick={handleJoinGroup}>
          Join this group
        </button>}
        {group && sessionUser && sessionUser.id === group.organizerId &&
          <div id='gray-buttons'>
            <button className="gray-btn" onClick={handleCreateEvent}>
              Create Event
            </button>
            <button className="gray-btn" onClick={handleUpdateEvent}>
              Update
            </button>
            <button className="gray-btn" >
              <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<DeleteModal groupId={groupId}/>}
         
            />
            </button>

            
          </div>
        }
      </div>
    </div>

  )
}

export default GroupInfoHead