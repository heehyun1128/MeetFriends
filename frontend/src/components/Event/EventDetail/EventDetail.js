import React from 'react'
import {NavLink} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { fetchEventDetail, fetchEvents } from '../../../store/event';

import './EventDetail.css'

const EventDetail = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams()
  // get current user
  const sessionUser = useSelector(state => state.session.user)
  // get all events
  const eventObj = useSelector((state) => (Object.values(state.events.allEvents).length ? state.events.allEvents : {}))
  const eventInfo = eventObj[eventId]
  // get single event
  const singleEventObj = useSelector((state) => (Object.values(state.events.singleEvent).length ? state.events.singleEvent : {}))
  const eventData = singleEventObj.eventData

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEventDetail(eventId));
  }, [dispatch, eventId]);

  // console.log(eventData?.Group?.GroupImages?.slice(0,1)[0].url)
  const groupImageUrl = eventData?.Group?.GroupImages?.slice(0, 1)[0].url
  const isPrivate = eventData?.Group?.private ? "Private":"Public"
  return (
    <div>
      <div className="event-detail-header">
        <div className="go-back-btn">
          <i class="fa-solid fa-angle-left"></i>
          <NavLink exact to="/events">Events</NavLink>
        </div>
        <h1>{eventData?.name}</h1>
        <p className="hosted-by">Hosted By {eventData?.Event?.Organizer.firstName} {eventData?.Event?.Organizer.lastName} </p>
      </div>
      <div className="event-detail-main">
        <img className='event-info-image' src={eventInfo && eventInfo.previewImage} alt="eventImage" />
        <div className="event-main-upper-right">
          <div className="event-main-group-info">
            <img className='group-info-image' src={groupImageUrl} alt="groupImage" />
            <div>
              <h1>{eventData?.Group?.name}</h1>
              <p>{isPrivate}</p>
            </div>
          </div>
          <div className="event-main-group-details">
            <div id="div-one"></div>
            <div id="div-two"></div>
            <div id="div-three"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail