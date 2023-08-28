import { csrfFetch } from "./csrf"

/** Action Type Constants: */
export const LOAD_EVENTS = '/events/LOAD_EVENTS'
export const GET_EVENT = '/events/GET_EVENT'
export const REMOVE_EVENT = '/events/REMOVE_EVENT'

/**  Action Creators: */
export const loadEvents = events => ({
  type: LOAD_EVENTS,
  events
})

export const getEvent = event => ({
  type: GET_EVENT,
  event
})

export const removeEvent = eventId => ({
  type: REMOVE_EVENT,
  eventId
})

/** Thunk Action Creators: */

export const fetchEvents = () => async (dispatch) => {
  const res = await csrfFetch('/api/events')

  if (res.ok) {
    const events = await res.json()
    dispatch(loadEvents(events))

    return events
  }
}
// Get details of event by id
export const fetchEventDetail = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`)

  if (res.ok) {
    const eventDetails = await res.json()

    dispatch(getEvent(eventDetails))
  } else {
    const errors = await res.json()
    return errors
  }
}

export const createEvent = event => async (dispatch) => {
  const res = await csrfFetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  })
  if (res.ok) {
    const newEvent = await res.json()
    dispatch(getEvent(newEvent))
    return newEvent
  } else {
    const errors = await res.json()
    return errors
  }
}

export const deleteEvent= (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  })
  if (res.ok) {

    dispatch(removeEvent(eventId))

  } else {
    const errors = await res.json()
    return errors
  }
}

// Event Reducer
const initialState = {
  allEvents: {},
  singleEvent: {}
}
// events: {
//   allEvents: {
//     [eventId]: {
//       eventData,
//         Event: {
//         eventData,
//         },
//       Venue: {
//         venueData,
//         },
//     },
//   },
//   // In this slice we have much more info about the event than in the allEvents slice.
//   singleEvent: {
//     eventData,
//       Event: {
//       eventData,
//       },
//     // Note that venue here will have more information than venue did in the all events slice. (Refer to your API Docs for more info)
//     Venue: {
//       venueData,
//       },
//     EventImages: [imagesData],
//       // These would be extra features, not required for your first 2 CRUD features
//       Members: [membersData],
//         Attendees: [attendeeData],
//     },
// },

const eventReducer = (state = initialState, action) => {
  let newState = {}

  switch (action.type) {
    case LOAD_EVENTS:
      newState = { ...state, allEvents: { ...state.allEvents } }
      action.events.Events.forEach(event => {

        // console.log(event)
        return newState.allEvents[event.id] = event
      })
      return newState
    case GET_EVENT:
      return {
        ...state,
        singleEvent: {
          ...state.singleEvent,
          eventData: action.event
        }
      }
    case REMOVE_EVENT:
      newState = { ...state }
      delete newState[action.reportId]
      return newState

    default:
      return state;
  }
};

export default eventReducer