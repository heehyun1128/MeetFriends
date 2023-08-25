import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <NavLink className="login-signup-link" to="/login">Log In</NavLink>
        <NavLink className="login-signup-link" to="/signup">Sign Up</NavLink>
      </li>
    );
  }


  return (
    <ul id='nav-div'>
      <li >
        <NavLink className="nav-link" exact to="/"><h1 id='logo-style'>MeetFriends</h1></NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;