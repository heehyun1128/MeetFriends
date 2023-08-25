import { csrfFetch } from './csrf'

// Create action creators: 
// set the session user in the session slice of state to the action creator's input parameter, 
// remove the session user. Their types should be extracted as a constant and used by the action creator and the session reducer.

/** Action Type Constants: */
export const SET_USER = "session/setUser";
export const REMOVE_USER = "session/removeUser";

/**  Action Creators: */
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
})

export const removeUser = () => ({
  type: REMOVE_USER,
})

/** Thunk Action Creators: */
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session')
  const data = await response.json()
  dispatch(setUser(data.user))
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
  dispatch(setUser(data.user));
  return res;
}

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

const initialState = {
  user: null
}
/** session reducer */
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer