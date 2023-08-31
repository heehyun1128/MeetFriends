import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { fetchEventDetail, fetchEvents } from '../../../store/event';

import DeleteEventModal from '../../DeleteModal/DeleteEventModal';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import './EventDetail.css'

const EventDetail = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams()
  // get current user
  const sessionUser = useSelector(state => state.session.user)
  // console.log("sessionUserId", sessionUser.id)
  // get all events
  const eventObj = useSelector((state) => (Object.values(state.events.allEvents).length ? state.events.allEvents : {}))
  const eventInfo = eventObj[eventId]
  // get single event
  const singleEventObj = useSelector((state) => (Object.values(state.events.singleEvent).length ? state.events.singleEvent : {}))
  const eventData = singleEventObj.eventData
  // console.log(eventData?.Group?.Organizer?.id === sessionUser.id)

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEventDetail(eventId));
  }, [dispatch, eventId]);


  const startDate = eventInfo?.startDate.split('T')[0]
  const startTime = eventInfo?.startDate.split('T')[1].slice(0, 8)
  const endDate = eventInfo?.endDate.split('T')[0]
  const endTime = eventInfo?.endDate.split('T')[1].slice(0, 8)
  const groupImageUrl = eventData?.Group?.GroupImages?.slice(0, 1)[0].url
  const isPrivate = eventData?.Group?.private ? "Private" : "Public"
  return (
    <div id="event-detail-page">
      <div id="event-detail-header">
        <div id="go-back-btn">
          <i class="fa-solid fa-angle-left"></i>
          <NavLink id="goback-event-nav" exact to="/events">Events</NavLink>
        </div>
        <h2>{eventData?.name}</h2>
        <p id="hosted-by">Hosted By {eventData?.Group?.Organizer.firstName} {eventData?.Group?.Organizer.lastName} </p>
      </div>
      <div id="event-detail-main">
        <div id="event-detail-main-upper">
          <div id="event-info-image-div">
            <img id='event-info-image' src={eventInfo && eventInfo.previewImage} alt="eventImage" />
          </div>
          <div id="event-main-upper-right">
            <div id="event-main-group-info">
              <div id='group-info-image-div'>
                <img id='group-info-image' src={groupImageUrl} alt="groupImage" />
              </div>
              <div>
                <h4>{eventData?.Group?.name}</h4>
                <p style={{ color: 'gray', marginTop: '10px' }}>{isPrivate}</p>
              </div>
            </div>
            <div id="event-main-group-details">
              <div id='event-main-group-detail-left'>
                <div id="div-one">
                  <div className='icon-div'><i style={{ color: 'gray' }} class="fa-regular fa-clock fa-lg"></i></div>
                  <div id="dates">
                    <div id="start-end">
                      <div id='flow-box'>
                        <p id='start' style={{ color: 'gray' }}>START</p>
                        <p style={{ color: '#0f6767' }}>{startDate}<p id='dot-dot'>.</p> {startTime}</p>
                      </div>
                      <div id='flow-box'>
                        <p id='end' style={{ color: 'gray' }}>END</p>
                        <p style={{ color: '#0f6767' }}>{endDate} <p id='dot-dot'>.</p>{endTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="div-two">
                  <div className='icon-div'><i id='dollar-icon' style={{ color: 'gray' }} class="fa-solid fa-dollar-sign"></i></div>
                  <div id='price'><p style={{ color: 'gray' }}>{eventData?.price || "FREE"}</p></div>
                </div>
                <div id="div-three">
                  <div className='icon-div'><i style={{ color: 'gray' }} class="fa-solid fa-map-pin fa-lg"></i></div>
                  <div><p style={{ color: 'gray' }}>{eventData?.type}</p></div>
                </div>
              </div>
              <div id='delete-event-btn-div'>
                {sessionUser && eventData?.Group?.Organizer?.id === sessionUser.id && <button id="delete-event-btn">
                  <OpenModalMenuItem
                    itemText="Delete"
                    modalComponent={<DeleteEventModal eventId={eventId} />}

                  /></button>}
              </div>
            </div>
          </div>
        </div>
        <div id="event-detail-main-lower">
          <h2>Details</h2>
          <p>{eventData?.description}</p>
        </div>
      </div>
    </div>
  )
}

export default EventDetail