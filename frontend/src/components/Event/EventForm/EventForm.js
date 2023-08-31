import React from 'react'
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../../../store/event';
import './EventForm.css'
import { useParams } from 'react-router-dom';
import { fetchGroups } from '../../../store/group';



const EventForm = ({ event }) => {
  const [name, setName] = useState("")
  const [eventType, setEventType] = useState("")
  const [eventVisibility, setEventVisibility] = useState("")
  const [price, setPrice] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")
  const [validationError, setValidationError] = useState({})

  const dispatch = useDispatch();
  const history = useHistory()
  const { groupId } = useParams()

  // get current group
  const groupObj = useSelector((state) => (Object.values(state.groups.allGroups).length ? state.groups.allGroups : {}))
  const groupInfo = groupObj[groupId]
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);


  const resetEventForm = () => {
    setName("")
    setEventType("")
    setEventVisibility("")
    setPrice("")
    setStartDate("")
    setEndDate("")
    setImageUrl("")
    setDescription("")
  }

  // format start date and end date for backend validation
  const formatDate = (date) => {
    if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/\d{4} (0[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/.test(date)) {

      const isMorning = date.split(" ")[2] === "AM" ? true : false
      const isNight = date.split(" ")[2] === "PM" ? true : false
      console.log(date.split(" "))

      let year = date.split(" ")[0].slice(6)
      let month = date.split(" ")[0].slice(0, 2)
      let day = date.split(" ")[0].slice(3, 5)
      let hour
      let minute = date.split(" ")[1].slice(3, 5)

      if (isMorning) {
        hour = date.split(" ")[1].slice(0, 2)
      }
      if (isNight) {
        hour = (Number(date.split(" ")[1].slice(0, 2)) + 12).toString()
      }
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:00`
      return formattedDate
    }else{
      return
    }

  }
  const handleEventFormSubmit = (e) => {
    e.preventDefault()
    // console.log(formatDate(startDate))

    event = {
      venueId: null,
      name,
      type: eventType,
      price: Number(price),
      description,
      startDate: startDate && formatDate(startDate),
      endDate: endDate && formatDate(endDate),
      imageUrl,
      private: eventVisibility
    }
    const newEvent = dispatch(createEvent(event, groupId)).then(
      (newEventRes) => {
        history.push(`/events/${newEventRes.id}`)
        resetEventForm()
        event = newEventRes
        console.log(event)
      }
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setValidationError(data.errors);
      }
      console.log(data.errors)
    });
    console.log(validationError)
  }

  return (
    <div id='event-form-container'>
      <h2>Create an event for {groupInfo?.name}</h2>
      <form onSubmit={handleEventFormSubmit}>
        <section className='event-form-section event-form-one'>
          <h4>What is the name of your event?</h4>
          <input
            id='event-name'
            type="text"
            placeholder='Event Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="group-event-errors">
            {validationError.name && `${validationError.name}`}
          </p>

        </section>
        <section className='event-form-section event-form-two'>
          <div>
            <h4>Is this an in person or online event?</h4>
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value)
                console.log(e.target.value)
              }}
            >
              <option value="" disabled selected>(select one)</option>
              <option value="In Person">In Person</option>
              <option value="Online">Online</option>
            </select>
            <p className="group-event-errors">
              {validationError.type && `${validationError.type}`}
            </p>
          </div>
          <div>
            <h4>Is this event private or public?</h4>
            <select
              value={eventVisibility}
              onChange={(e) => {
                setEventVisibility(e.target.value)
                console.log(e.target.value)
              }}
            >
              <option value="" disabled selected>(select one)</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <p className="group-event-errors">
              {validationError.private && `${validationError.private}`}
            </p>
          </div>
          <div>
            <h4>What is the price for your event?</h4>
            <div className='flow-div flow-div-price'>
              <h4>$</h4>
              <input
                id='price-input'
                type="number"
                placeholder='0'
                value={price}
                onWheel={(e) => {

                  e.target.blur()
                  e.stopPropagation();

                }}
                onChange={(e) => {

                  // console.log(typeof Number(e.target.value))

                  setPrice(e.target.value)
                }}
              />
            </div>
            <p className="group-event-errors">
              {validationError.price && `${validationError.price}`}
            </p>
          </div>
        </section>
        <section className='event-form-section event-form-three'>
          <div>
            <h4>When does your event start?</h4>
            <div className='flow-div flow-div-date'>
              <input
                type="text"
                placeholder='MM/DD/YYYY HH:mm AM'
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                }}
              />
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <p className="group-event-errors">
              {validationError.startDate && `${validationError.startDate}`}
            </p>
          </div>
          <div>
            <h4>When does your event end?</h4>
            <div className='flow-div flow-div-date'>
              <input
                type="text"
                placeholder='MM/DD/YYYY HH:mm AM'
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                }}
              />
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <p className="group-event-errors">
              {validationError.endDate && `${validationError.endDate}`}
            </p>
          </div>
        </section>
        <section className='event-form-section event-form-four'>
          <h4>Please add in image url for your event below:</h4>
          <input
            type="text"
            placeholder='Image URL'
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
            }}
          />
          <p className="group-event-errors">
            {validationError.imageUrl && `${validationError.imageUrl}`}
          </p>
        </section>
        <section className='event-form-section event-form-five'>
          <h4>Please describe your event:</h4>
          <textarea name="" id="" cols="30" rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
          </textarea>
          <p className="group-event-errors">
            {validationError.description && `${validationError.description}`}
          </p>
        </section>
        <button id="create-event-btn">Create Event</button>
      </form>
    </div>
  )
}

export default EventForm