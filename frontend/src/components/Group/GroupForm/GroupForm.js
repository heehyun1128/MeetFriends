import React from 'react'
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createGroup } from '../../../store/group';


import './GroupForm.css'
const GroupForm = () => {




  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [groupType, setGroupType] = useState("")
  const [groupVisibility, setGroupVisibility] = useState("")
  const [groupVisibilityBoolean, setGroupVisibilityBoolean] = useState()
  const [groupImageUrl, setgroupImageUrl] = useState("")
  const [validationError, setValidationError] = useState({})

  const dispatch = useDispatch();

  const resetGroupForm = () => {
    setCity("")
    setState("")
    setGroupName("")
    setDescription("")
    setGroupType("")
    setGroupVisibility("")
    setgroupImageUrl("")
    setValidationError("")
  }
  useEffect(() => {
    if (groupVisibility === "Public") {
      setGroupVisibilityBoolean(Boolean(true))
    }
    if (groupVisibility === "Private") {
      setGroupVisibilityBoolean(Boolean(false))
    }
    if (groupVisibility === "") {
      setGroupVisibilityBoolean("")
    }
    return () => {

    };
  }, [groupVisibility]);

  const history = useHistory()
  const handleGroupFormSubmit = (e) => {
    console.log(groupVisibility)

    console.log(Boolean(groupVisibilityBoolean))
    e.preventDefault()
    const groupInfo = {
      city,
      state,
      name: groupName,
      about: description,
      type: groupType,
      private: groupVisibilityBoolean,
      imageUrl: groupImageUrl
    }
    // const imageUrl = groupImageUrl 
    const newGroup = dispatch(createGroup(groupInfo)).then(
      (newGroupRes) => {
        history.push(`/groups/${newGroupRes.id}`)
        resetGroupForm()
       
      }

    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setValidationError(data.errors);
      }
      console.log(data.errors)
    });


  }

  return (
    <div id="group-form-div">
      <form onSubmit={handleGroupFormSubmit}>
        <section className="group-form-section one">
          <h4>BECOME AN ORGANIZER</h4>
          <h2>We'll walk you through a few steps to build your local community</h2>
        </section>
        <section className="group-form-section two">
          <h2>First, set your group's location</h2>
          <p>MeetFriends groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online</p>
          <input
            type="text"
            placeholder='city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder='STATE  e.g.CA'
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <p className="group-form-errors">
            {validationError.city && `${validationError.city}`}
            {validationError.state && `${validationError.state}`}
          </p>
        </section>
        <section className="group-form-section three">
          <h2>What will your group's name be?</h2>
          <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <input
            type="text"
            placeholder='What is your group name?'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <p className="group-form-errors">
            {validationError.name && `${validationError.name}`}
          </p>
        </section>
        <section className="group-form-section four">
          <h2>Now describe what your group will be about</h2>
          <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
          <ol>
            <li>1. What's the purpose of the group?</li>
            <li>2. Who should join?</li>
            <li>3. What will you do at your events?</li>
          </ol>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder='Please write at least 30 characters'
            value={description}
            onChange={(e) => setDescription
              (e.target.value)}
          ></textarea>
          <p className="group-form-errors">
            {validationError.about && `${validationError.about}`}</p>
        </section>
        <section className="group-form-section five">
          <h2>Final Steps...</h2>
          <div>
            <h4>Is this an in person or online group?</h4>
            <select
              name=""
              id=""
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
            >
              <option value="" disabled selected>(select one)</option>
              <option value="In Person">In Person</option>
              <option value="Online">Online</option>
            </select>
            <p className="group-form-errors">
              {validationError.type && `${validationError.type}`}
            </p>
          </div>
          <div>
            <h4>Is this group private or public?</h4>
            <select
              name=""
              id=""
              value={groupVisibility}
              onChange={(e) => {
                setGroupVisibility(e.target.value)
                console.log("changed???")
              }}
            >
              <option value="" disabled selected>(select one)</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <p className="group-form-errors">
              {validationError.private && `${validationError.private}`}
            </p>
          </div>
          <div>
            <h4>Please add an image url for your group below:</h4>
            <input
              type="text"
              placeholder='Image Url'
              value={groupImageUrl}
              onChange={e => setgroupImageUrl(e.target.value)}
            />
          </div>
          <p className="group-form-errors">
            {validationError.imageUrl && `${validationError.imageUrl}`}
          </p>
        </section>
        <button id="create-group-btn">Create Group</button>
      </form>
    </div>
  )
}

export default GroupForm