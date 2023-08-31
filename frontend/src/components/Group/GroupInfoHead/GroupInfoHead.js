import React from 'react'
import './GroupInfoHead.css'
import { useSelector } from "react-redux";
import {useHistory,useParams} from 'react-router-dom'
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import DeleteModal from '../../DeleteModal/DeleteModal';


// const GroupInfoHead = ({ group,groupData }) => {
const GroupInfoHead = ({ groupData, groupInfo }) => {
  const sessionUser = useSelector(state => state.session.user)
  const handleJoinGroup = e => {
    e.preventDefault()
    alert("Feature coming soon...")
  }

  const history = useHistory()
  const {groupId} = useParams()
  const handleCreateEvent = e => {
    e.preventDefault()
    history.push(`/groups/${groupId}/events/new`)
  }
  const handleUpdateEvent = e => {
    e.preventDefault()
    history.push(`/groups/${groupId}/edit`)
  }
  // console.log(group)
  // console.log(groupInfo)
 

  return (
    <div id="group-info-head-container">
      <div className="image-div">
        {/* <img className='group-info-image' src={groupData && groupData.GroupImages && groupData.GroupImages.find(image=>image.preview===true).url} alt="groupImage" /> */}
        <img className='group-info-image' src={groupInfo && groupInfo.previewImage} alt="groupImage" />
      </div>
      <div className="group-head-right">
        <div>
          <h1>{groupData && groupData.name}</h1>
          <div className="group-info-sub-head">
            <p className='group-info-city'>{groupData && groupData.city}</p>
            <div className='event-privacy-div'>
              <p className='group-info-numEvents'>{groupData && groupData.numEvents} events</p>
              <div className="group-info-centered-dot"><p>.</p></div>
              <p className='group-info-private'>{groupData && groupData.private ? "Private" : "Public"}</p>
            </div>
            <p className="group-info-organizer">Organized By {groupData && groupData.Organizer && groupData.Organizer.firstName} {groupData && groupData.Organizer && groupData.Organizer.lastName}</p>
          </div>
        </div>
        {groupData && sessionUser && sessionUser.id !== groupData.organizerId && <button id="join-this-group-btn" onClick={handleJoinGroup}>
          Join this group
        </button>}
        {groupData && sessionUser && sessionUser.id === groupData.organizerId &&
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