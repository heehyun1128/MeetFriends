import React from 'react'
import EventList from '../../Event/EventList/EventList'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchEvents } from '../../../store/event';
import { useParams } from 'react-router-dom'
import './GroupInfoMain.css'

const GroupInfoMain = ({ group }) => {
  const { groupId } = useParams()
  // console.log(groupId)

  const eventObj = useSelector((state) => (state.events.allEvents ? state.events.allEvents : {}))

  const events = Object.values(
    eventObj
  );
  // group events
  const groupEvents = events.filter(event => Number(event.groupId) === Number(groupId))
  // console.log(new Date())

  // upcoming events
  const upcomingEvents = groupEvents.filter(event => new Date(event.startDate) > new Date())
  upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const upcomingEventCount = upcomingEvents.length

  // past events
  const pastEvents = groupEvents.filter(event => new Date(event.startDate) < new Date())
  pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  const pastEventCount = pastEvents.length

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div id='group-info-main-div'>
      <div className="group-info-main-organizer">
        <h1>Organizer</h1>
        <p>{group && `${group.organizer.firstName} ${group.organizer.lastName}`}</p>
      </div>
      <div className="group-info-main-about">
        <h2>What we're about</h2>
        <p className="about-detail">
          {group && group.about}
        </p>
      </div>
     {upcomingEvents.length ? (<div className="upcoming-events">
        <h2>Upcoming Events ({upcomingEventCount})</h2>
        { <EventList events={upcomingEvents} />}
      </div>):(<h2>No Upcoming Events</h2>)}
      {pastEvents.length ? (<div className="past-events">
        <h2>Past Events ({pastEventCount})</h2>
        {<EventList events={pastEvents} />}
      </div>):(<></>)}
    </div>
  )
}

export default GroupInfoMain