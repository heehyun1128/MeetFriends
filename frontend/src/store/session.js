import { csrfFetch } from './csrf'

// Create action creators: 
// set the session user in the session slice of state to the action creator's input parameter, 
// remove the session user. Their types should be extracted as a constant and used by the action creator and the session reducer.

/** Action Type Constants: */
export const SET_SESSION_USER = 'session/SET_SESSION_USER'
export const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER'

/**  Action Creators: */
export const setSessionUser = (user) => ({
  type: SET_SESSION_USER,
  user
})

export const removeSessionUser = () => ({
  type: REMOVE_SESSION_USER,
})

/** Thunk Action Creators: */
export const login = (user) => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (res.ok) {
    const user = await res.json()
    dispatch(setSessionUser(user))
    return user
  } else {
    const errors = await res.json()
    return errors
  }
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session')
  const data = await response.json()
  dispatch(setSessionUser(data.user))
  return response
}

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user
  const res = await csrfFetch('/api/users',{
    method:'POST',
    body: JSON.stringify({ username, firstName, lastName, email, password })
  })
  const data = await res.json();
  console.log('Restored User:', data.user); // Log the user data
  dispatch(setSessionUser(data.user));
  return res;
}

const initialState = {
  user: null
}
/** session reducer */
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return { ...state, user: action.user }
    case REMOVE_SESSION_USER:
      return { ...state, user: null }
    default:
      return state
  }
}

export default sessionReducer