// import ACTIVITIES from '../../data/dummy-data.js';
// import state from './user';
import { 
  DELETE_ACTIVITY, 
  CREATE_ACTIVITY, 
  UPDATE_ACTIVITY, 
  SET_ACTIVITIES,
  JOIN_ACTIVITY,
  QUIT_ACTIVITY
} from '../actions/activity.js';
import Activity from '../../model/activity.js';

const initialState = {
  availableActivities: [],
  // userActivities: ACTIVITY.filter(activity => activity.ownerId === 'u1'),
  // userActivities: ACTIVITIES.filter(activity => activity.participants.includes('u1')),
  userActivities: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVITIES:
      return {
        availableActivities: action.activities,
        userActivities: action.userActivities
      };

    case JOIN_ACTIVITY:
      const joinedActivity = new Activity(
        action.ActivityData.aid,
        action.ActivityData.ownerId,
        action.ActivityData.title,
        action.ActivityData.time,
        action.ActivityData.location,
        action.ActivityData.organizer,
        action.ActivityData.participants,
        action.ActivityData.description
      );
      // const joinedUserActivities = [...state.userActivities];
      // joinedUserActivities[joinActivityIndex] = joinedActivity;

      const joinAvailableActivityIndex = state.userActivities.findIndex(
        activity => activity.aid === action.aid
      );
      const joinedAvailableActivityies= [...state.availableActivities];
      joinedAvailableActivityies[joinAvailableActivityIndex] = joinedActivity;

      return {
        ...state,
        availableActivities: joinedAvailableActivityies,
        userActivities: state.userActivities.concat(joinedActivity),
      }

      case QUIT_ACTIVITY:
        const quitedActivityIndex = state.userActivities.findIndex(
          activity => activity.aid === action.aid
        );
        const quitededActivity = new Activity(
          action.ActivityData.aid,
          action.ActivityData.ownerId,
          action.ActivityData.title,
          action.ActivityData.time,
          action.ActivityData.location,
          action.ActivityData.organizer,
          action.ActivityData.participants,
          action.ActivityData.description
        );
        
        const quitedAvailableActivityies= [...state.availableActivities];
        quitedAvailableActivityies[quitedActivityIndex] = quitededActivity;
  
        return {
          ...state,
          availableActivities: quitedAvailableActivityies,
          userActivities: state.userActivities.filter(
            activity => activity.aid !== action.aid
          ),
        }

    case CREATE_ACTIVITY:
      const newActivity = new Activity(
        action.ActivityData.aid,
        action.ActivityData.ownerId,
        action.ActivityData.title,
        action.ActivityData.time,
        action.ActivityData.location,
        action.ActivityData.organizer,
        action.ActivityData.participants,
        action.ActivityData.description
      );
      return {
        ...state,
        availableActivities: state.availableActivities.concat(newActivity),
        userActivities: state.userActivities.concat(newActivity),
      };

    case UPDATE_ACTIVITY:
      const activityIndex = state.userActivities.findIndex(
        activity => activity.aid === action.aid
      );
      const updatedActivity = new Activity(
        action.ActivityData.aid,
        action.ActivityData.ownerId,
        action.ActivityData.title,
        action.ActivityData.time,
        action.ActivityData.location,
        action.ActivityData.organizer,
        action.ActivityData.participants,
        action.ActivityData.description
      );
      const updatedUserActivities = [...state.userActivities];
      updatedUserActivities[activityIndex] = updatedActivity;

      const availableActivityIndex = state.userActivities.findIndex(
        activity => activity.aid === action.aid
      );
      const updatedAvailableActivityies= [...state.availableActivities];
      updatedAvailableActivityies[availableActivityIndex] = updatedActivity;

      return {
        ...state,
        availableActivities: updatedAvailableActivityies,
        userActivities: updatedUserActivities
      }

    case DELETE_ACTIVITY:
      return {
        ...state,
        userActivities: state.userActivities.filter(
          activity => activity.aid !== action.aid
        ),
        availableActivities: state.availableActivities.filter(
          activity => activity.aid !== action.aid
        ),
      };
  }
  return state;
};

