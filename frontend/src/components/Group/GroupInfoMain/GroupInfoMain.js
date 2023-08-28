import React from 'react'

const GroupInfoMain = ({group}) => {
  return (
    <div>
      <div className="group-info-main-organizer">
        <h1>Organizer</h1>
        <p>{group && `${group.Organizer.firstName} ${group.Organizer.lastName}` }</p>
      </div>
      <div className="group-info-main-about">
        <h2>What we're about</h2>
        <p className="about-detail">
          {group && group.about}
        </p>
      </div>
      <div className="upcoming-events">
        <h2>Upcoming Events ({group &&group.numEvents})</h2>
        {/* <EventCard /> */}
      </div>
    </div>
  )
}

export default GroupInfoMain