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

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }


  return (
    <ul id='nav-div'>
      <li >
        <NavLink className="nav-link" exact to="/"><h1 id='logo-style'>MeetFriends</h1></NavLink>
      </li>
      {/* {isLoaded && sessionLinks} */}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;