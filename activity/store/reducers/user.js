// import ACTIVITY from '../../data/dummy-data.js';
import { LOGIN, SIGNUP, LOGOUT } from '../actions/user';

const initialState = {
  // availableActivities: ACTIVITY,
  // // userActivities: ACTIVITY.filter(activity => activity.ownerId === 'u1'),
  // userActivities: ACTIVITY.filter(activity => activity.participants.includes('u1')),
  // userInfo: {}
  token: null,
  userId: null,
  username: null,
  firstName: null,
  lastName: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
          token: action.token,
          userId:action.userId,
          username: action.username,
          firstName: action.firstName,
          lastName: action.lastName
      };

    case SIGNUP:
      return {
        token: action.token,
        userId:action.userId,
        username: action.username,
        firstName: action.firstName,
        lastName: action.lastName
      };
    case LOGOUT:
      return initialState;

    default:
      return state;
  };
}