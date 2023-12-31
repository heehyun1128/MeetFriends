import { csrfFetch } from "./csrf"

/** Action Type Constants: */
export const LOAD_GROUPS = '/groups/LOAD_GROUPS'
export const GET_GROUP = '/groups/GET_GROUP'
export const EDIT_GROUP = '/groups/EDIT_GROUP'
export const REMOVE_GROUP = '/groups/REMOVE_GROUP'

/**  Action Creators: */
export const loadGroups = groups => ({
  type: LOAD_GROUPS,
  groups
})

export const getGroup = (group) => ({
  type: GET_GROUP,
  group,
})
export const editGroup = group => ({
  type: EDIT_GROUP,
  group
})

export const removeGroup = groupId => ({
  type: REMOVE_GROUP,
  groupId
})

/** Thunk Action Creators: */

export const fetchGroups = () => async (dispatch) => {
  const res = await csrfFetch('/api/groups')

  if (res.ok) {
    const groups = await res.json()
    dispatch(loadGroups(groups))
    // console.log("fetch groups action creator", groups)
    return groups
  }else{
    const errors = await res.json()
    return errors
  }
}

export const fetchGroupDetail = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`)

  if (res.ok) {
    const groupDetails = await res.json()
    dispatch(getGroup(groupDetails))
    return groupDetails
  } else {
    let errors = await res.json()
    // console.log("fetchGroupDetail",errors)
    return errors
    
   
  }
}

export const createGroup = group => async (dispatch) => {
  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group)
  })

  if (res.ok) {
    const newGroup = await res.json()
    dispatch(getGroup(newGroup))
    return newGroup
  } else {

    const errors = await res.json()

    return errors
  }
}

export const updateGroup = group => async (dispatch) => {
  // console.log("update group reducer passed in data",group)
  const res = await csrfFetch(`/api/groups/${group.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group)
  })
  if (res.ok) {
    const updatedGroup = await res.json()
    // console.log("update group reducer returned data",updatedGroup)
    dispatch(editGroup(updatedGroup))
    return updatedGroup
  } else {
    const errors = await res.json()
    return errors
  }
}

export const deleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  })
  if (res.ok) {

    dispatch(removeGroup(groupId))

  } else {
    const errors = await res.json()
    return errors
  }
}


// groupReducer
const initialState = {
  allGroups: {},
  singleGroup: {}
}
const groupReducer = (state = initialState, action) => {
  // let newState = {}
  // store shape:
  // groups: {
  //   allGroups: {
  //     [groupId]: {
  //       groupData,
  //     },
  //     optionalOrderedList: [],
  //   },
  // singleGroup: {
  //   groupData,
  //     GroupImages: [imagesData],
  //       Organizer: {
  //     organizerData,
  //     },
  //   Venues: [venuesData],
  //   },

  switch (action.type) {
    case LOAD_GROUPS:
      const updatedState = { 
        ...state, 
        allGroups: { ...state.allGroups }
       }
      action.groups.Groups.forEach(group => {
        updatedState.allGroups[group.id] = group
      }
      )

      return updatedState
    case GET_GROUP:
      return {
        ...state,
        allGroups: {
          ...state.allGroups,
          [action.group.id]: action.group
        },
        singleGroup: {
          ...state.singleGroup,
          groupData:action.group
        }
      }
    case EDIT_GROUP:
      // console.log("state.singleGroup",action.group)
      return {
        ...state,
        allGroups:{
          ...state.allGroups,
          [action.group.id]:action.group
        },
        singleGroup: {
          ...state.singleGroup,
          groupData: action.group,
        }
      }
    case REMOVE_GROUP:
      const newState = { ...state, allGroups: { ...state.allGroups } }
      delete newState.allGroups[action.groupId]
      // console.log("Del", newState)
      return newState

    default:
      return state;
  }
};

export default groupReducer