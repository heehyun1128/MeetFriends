import { csrfFetch } from "./csrf"
import { REMOVE_GROUP } from "./group"
/** Action Type Constants: */
export const LOAD_EVENTS = '/events/LOAD_EVENTS'
export const GET_EVENT = '/events/GET_EVENT'
export const REMOVE_EVENT = '/events/REMOVE_EVENT'

/**  Action Creators: */
export const loadEvents = events => ({
  type: LOAD_EVENTS,
  events
})

export const getEvent = (event,groupId) => ({
  type: GET_EVENT,
  payload:{
    event,
    groupId
  }
})

export const removeEvent = (groupId,eventId) => ({
  type: REMOVE_EVENT,
  groupId,
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


export const createEvent = (event,groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
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

export const deleteEvent= (groupId,eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  })
  if (res.ok) {

    dispatch(removeEvent(groupId, eventId))

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
      const updatedState = { ...state, allEvents: { ...state.allEvents } }
      action.events.Events.forEach(event => {

        console.log(event)
        // newState.allEvents={...newState.allEvents, [event.id] : event}
        updatedState.allEvents[event.id] = event
      })
      return updatedState
    case GET_EVENT:
      return {
        ...state,
        allEvents:{
          ...state.allEvents,
          [action.payload.event.id]:action.payload.event
        },
        singleEvent: {
          ...state.singleEvent,
          eventData: action.payload.event
        }
      }
    case REMOVE_EVENT:
      // newState = { ...state }
      newState = { ...state, allEvents: { ...state.allEvents } }
      delete newState.allEvents[action.eventId]
      return newState

    case REMOVE_GROUP:
      const removedGroupId = action.groupId
      console.log(action.groupId)
      const filterEvent = { ...state.allEvents }
      console.log(filterEvent)
      Object.keys(filterEvent).forEach((eventId)=>{
        const eventEle = filterEvent[eventId]
        console.log(eventEle)
        console.log(Number(eventEle.groupId) === Number(removedGroupId))
        if (Number(eventEle.groupId) === Number(removedGroupId)){
          delete filterEvent[eventId]
        }
        
      })
      console.log(filterEvent)
      return {
        ...state,
        allEvents: filterEvent
      }
    default:
      return state;
  }
};

export default eventReducer