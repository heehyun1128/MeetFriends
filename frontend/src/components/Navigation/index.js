import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='nav-div'>
      <li >
        <NavLink className="nav-link" exact to="/"><h1 id='logo-style'>MeetFriends</h1></NavLink>
      </li>
      {/* {isLoaded && sessionLinks} */}
      
      {isLoaded && (
        <li id="navbar-right">
          {sessionUser && <NavLink id='navbar-right-create-group' exact to="/create-group">Start a new group</NavLink>}
          <ProfileButton user={sessionUser} />
        
        </li>
      )}
    </ul>
  );
}

export default Navigation;