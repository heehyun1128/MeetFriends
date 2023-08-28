import React from 'react'
import './GroupDetail.css'
import {useHistory} from 'react-router-dom'

const GroupDetail = ({group}) => {
const history = useHistory()
  const handleViewGroupDetail = (e)=>{
    e.preventDefault()
    history.push(`/groups/${group.id}`)
  }
  return (
    <div className="group-detail-div" onClick={handleViewGroupDetail}>
      <img className='group-image' src={group.previewImage} alt="" />
      <div className="group-info">
        <h3 className='groupName'>{group.name}</h3>
        <p className="city">{group.city}</p>
        <p className="about">{group.about}</p>
        <div className="group-info-foot">
          <p className='numEvents'>{group.numEvents} events</p>
          <div className="centered-dot"><p>.</p></div>
          <p className='private'>{group.private? "Private":"Public"}</p>
        </div>
      </div>
    </div>
  )
}

export default GroupDetail