import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory,NavLink } from 'react-router-dom'
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  const history = useHistory()

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const handleViewGroup = (e) => {
    e.preventDefault();
    closeMenu();
    history.push('/groups')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id="navbar-right">
      <div onClick={openMenu} id='profile-div'>
        <button id="profile-button" >
          <i className="fas fa-user-circle fa-2xl" />
        </button>
        {showMenu ? (<i class="fa-solid fa-angle-up"></i>) : (<i class="fa-solid fa-angle-down"></i>)}
      </div>

      <ul className={ulClassName} ref={ulRef}>

        {user ? (
          <>
            <li>Hello, {user.username}</li>
            {/* <li>{user.firstName} {user.lastName}</li> */}
            <li>{user.email}</li>
            <NavLink onClick={handleViewGroup} id='start-new-group-nav' exact to='/groups'>View Groups</NavLink>
            <li id="logout-btn-li">
              <button id="logout-button" onClick={logout}>Log Out</button>
            </li>
            
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              id="login-nav-link"
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              id="signup-nav-link"
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;