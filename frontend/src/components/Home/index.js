
import './Home.css'

import homeTabImage1 from '../../images/home/home-tab-1.svg'
import homeTabImage2 from '../../images/home/home-tab-2.svg'
import homeTabImage3 from '../../images/home/home-tab-3.svg'
import homeMainImage from '../../images/home/home-main-img.svg'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'

const Home = () => {
  const sessionUser = useSelector(state => state.session.user)


  const [startGroupDisabled, setStartGroupDisabled] = useState(true)

  useEffect(() => {
    if (sessionUser) {
      setStartGroupDisabled(false)
    } else {
      setStartGroupDisabled(true)
    }

  }, [sessionUser])

  const history = useHistory()
  const handleSeeAllGroups = (e) => {
    e.preventDefault()
    history.push('/groups')
  }
  const handleFindEvent = (e) => {
    e.preventDefault()
    history.push('/events')
  }
  const handleStartGroup = (e) => {
    e.preventDefault()
    history.push('/create-group')
  }

  const startGroupBtn = "home-detail-item-tab-btn" + (startGroupDisabled ? " disabled" : "")

  return (
    <div id='home-main'>
      <div id="home-intro-section">
        <div id="home-intro-section-left">
          <h1 id="intro-head">
            The people platform. Where interests become friendships.
          </h1>
          <p id="intro-description">
            Your new friends and community are waiting for you. People have chosen MeetFriends to make reals friends and connections through joining multiple groups and events. Come join us and start a group today.
          </p>
        </div>
        <div id="home-intro-section-right">
          <img src={homeMainImage} alt="" />
        </div>
      </div>
      <div id="home-detail-section">
        <h2 id='home-detail-section-title'>How MeetFriends Works</h2>
        <p id='home-detail-section-text'>Check out below to see how MeetFriends Works</p>
      </div>
      <div id="home-detail-section">
        <div id="home-detail-items">
          <div className='home-detail-item-tab' >
            <img src={homeTabImage1} alt="" />
            <button onClick={handleSeeAllGroups} className="home-detail-item-tab-btn">See All Groups</button>
            <p className="home-detail-item-tab-text">
              Meet people that love what you love and start your next journey.
            </p>
          </div>
          <div className='home-detail-item-tab'>
            <img src={homeTabImage2} alt="" />
            <button onClick={handleFindEvent} className="home-detail-item-tab-btn">Find An Event</button>
            <p className="home-detail-item-tab-text">
              Join an event to meet your future friends!
            </p>
          </div>
          <div className='home-detail-item-tab'>
            <img src={homeTabImage3} alt="" />
            <button onClick={handleStartGroup} disabled={startGroupDisabled} className={startGroupBtn}>Start A New Group</button>
            <p className="home-detail-item-tab-text">
              Create a group here to gather people with shared interests.
            </p>
          </div>
        </div>
      </div>
      <div id="home-detail-section">
        {!sessionUser && <button id='home-join-button'>Join MeetFriends</button>}
      </div>
    </div>
  )
}

export default Home