import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [logInDivStyle, setLogInDivStyle] = useState("initial-login-div")
  const [logInInputStyle, setLogInInputStyle] = useState("initial-login-input-label")
  const [logInFormStyle, setLogInFormStyle] = useState("initial-login-form")
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [credential,password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUserLogIn = (e) => {
    e.preventDefault()
    setErrors({});
    return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }
  return (
    // conditionally render css
    
    <div id={logInDivStyle}>
      <h1>Log In</h1>
      <form id={logInFormStyle} onSubmit={handleSubmit}>
        <label className={logInInputStyle}>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className={logInInputStyle}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="login-input-error">{errors.credential}</p>}
        <button disabled={disabled} type="submit">Log In</button>
        <div onClick={demoUserLogIn} id="demo-user-login">Demo User</div>
      </form>
    </div>
  );
}

export default LoginFormModal;