import React from 'react'
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createGroup, updateGroup } from '../../../store/group';

import './GroupForm.css'

const GroupForm = ({ group, groupInfo,formType }) => {
  const history = useHistory()
  console.log("group.GroupImages", group.GroupImages)

  const [city, setCity] = useState(group.city || "")
  const [state, setState] = useState(group.state || "")
  const [groupName, setGroupName] = useState(group.name || "")
  const [description, setDescription] = useState(group.about || "")
  const [groupType, setGroupType] = useState(group.type || "")
  const [groupVisibility, setGroupVisibility] = useState(group.private.toString() || "")
 
  const [groupImageUrl, setgroupImageUrl] = useState(groupInfo?.previewImage  || "")
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


  const handleGroupFormSubmit = (e) => {
    e.preventDefault()

    if (formType === "createGroup") {
      group = {
        city,
        state,
        name: groupName,
        about: description,
        type: groupType,
        private: groupVisibility,
        imageUrl: groupImageUrl
      }
      const newGroup = dispatch(createGroup(group)).then(
        (newGroupRes) => {
          history.push(`/groups/${newGroupRes.id}`)
          resetGroupForm()
          group = newGroupRes
        }
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationError(data.errors);
        }
    
      });
    } else if (formType === "updateGroup") {
      // console.log(group)
      group = {
        ...group,
        city,
        state,
        name: groupName,
        about: description,
        type: groupType,
        private: JSON.parse(groupVisibility),
        imageUrl: groupImageUrl,
        // GroupImages: [...group.GroupImages[0],url:groupImageUrl]
      }
      group.GroupImages[0].url = groupImageUrl
    
      const updatedGroup = dispatch(updateGroup(group))
        .then(
          (updatedGroupRes) => {
            resetGroupForm()
            group = updatedGroupRes
            // console.log(group)
            history.push(`/groups/${updatedGroupRes.id}`)
          }
        ).catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setValidationError(data.errors);
          }
   
        });
    }



  }

  return (
    <div id="group-form-div">
      <form onSubmit={handleGroupFormSubmit}>
        <section className="group-form-section one">
          {formType ==="createGroup" && <h4>START A NEW GROUP</h4>}
          {formType ==="updateGroup" && <h4>UPDATE YOUR GROUP'S INFORMATION</h4>}
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
            <div className="select-container">
              <select
                value={groupVisibility}
                onChange={(e) => {
                  setGroupVisibility(e.target.value)
                  // console.log(e.target.value)
                }}
              >
                <option value="" disabled selected>(select one)</option>
                <option value="false">Public</option>
                <option value="true">Private</option>
              </select>
            </div>
            <p className="group-form-errors">
              {validationError.private && `${validationError.private}`}
            </p>
          </div>
          <div>
            {formType === "createGroup" && <>
            <h4>Please add an image url for your group below:</h4>
              <input
                type="text"
                placeholder='Image Url'
                value={groupImageUrl}
                onChange={e => {
                  // console.log("groupImageUrl", groupImageUrl)
                  setgroupImageUrl(e.target.value)
                }}
              />
            </>}
          </div>
          <p className="group-form-errors">
            {validationError.imageUrl && `${validationError.imageUrl}`}
          </p>
        </section>
        {formType==="createGroup" && <button id="create-group-btn">Create Group</button>}
        {formType==="updateGroup" && <button id="create-group-btn">Update Group</button>}
      </form>
    </div>
  )
}

export default GroupForm