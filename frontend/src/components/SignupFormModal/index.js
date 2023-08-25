import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

// handle css style changes
  const [signupDivStyle, setSignupDivStyle] = useState("initial-signup-div")
  const [signupFormStyle, setSignupFormStyle] = useState("initial-signup-form")
  const [signupLabelStyle, setSignupLabelStyle] = useState("initial-signup-input-label")

  // handle user input validation
  const [disabled, setDisabled] = useState(false)

  useEffect(()=>{
    if (!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length || username.length < 4 || password.length<6){
      setDisabled(true)
    }else{
      setDisabled(false)
    }
  }, [email,
    username,
    firstName,
    lastName,
    password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
          console.log(data.errors)
        });
    }
    return setErrors({...errors,
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div id={signupDivStyle}>
      <h1>Sign Up</h1>
      <form id={signupFormStyle} onSubmit={handleSubmit}>
        <label className={signupLabelStyle}>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="signup-error-msg">{errors.email}</p>}
        <label className={signupLabelStyle}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="signup-error-msg">{errors.username}</p>}
        <label className={signupLabelStyle}>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="signup-error-msg">{errors.firstName}</p>}
        <label className={signupLabelStyle}>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="signup-error-msg">{errors.lastName}</p>}
        <label className={signupLabelStyle}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="signup-error-msg">{errors.password}</p>}
        <label className={signupLabelStyle}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="signup-error-msg">{errors.confirmPassword}</p>}
        <button disabled={disabled} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;