import React from "react";
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEvent } from "../../store/event";
import { fetchEvents } from '../../store/event'
import './DeleteModal.css'

const DeleteModal = ({ eventId }) => {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const history = useHistory()
  const handleDelete = (e) => {

    e.preventDefault();
    dispatch(deleteEvent(eventId)).then(() => {

      closeModal()

      history.push('/events')
      //  dispatch(fetchEvents());
    })




  }

  const closeDeleteModal = e => {
    e.preventDefault();
    closeModal()

  }
  return (
    <div id="delete-modal-container">
      <h3 id='delete-modal-header'>Confirm Delete</h3>
      <p className="delete-modal-msg">
        Are you sure you want to remove this event?
      </p>
      <button onClick={handleDelete} className="delete-modal-btn yes">{`Yes (Delete Event)`}</button>
      <button onClick={closeDeleteModal} className="delete-modal-btn no">{`No (Keep Event)`}</button>
    </div>
  )
}

export default DeleteModal