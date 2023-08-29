import React from "react";
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroup } from "../../store/group";
import { fetchGroups } from '../../store/group'
import './DeleteModal.css'

const DeleteModal = ({ groupId }) => {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const history = useHistory()
  const handleDelete = (e) => {

    e.preventDefault();
   dispatch(deleteGroup(groupId)).then(()=>{

     closeModal()

     history.push('/groups')
    //  dispatch(fetchGroups());
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
        Are you sure you want to remove this group?
      </p>
      <button onClick={handleDelete} className="delete-modal-btn yes">{`Yes (Delete Group)`}</button>
      <button onClick={closeDeleteModal} className="delete-modal-btn no">{`No (Keep Group)`}</button>
    </div>
  )
}

export default DeleteModal