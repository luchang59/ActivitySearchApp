import Activity from "../../model/activity";

export const DELETE_ACTIVITY = 'DELETE_PRODUCT';
export const CREATE_ACTIVITY = 'CREATE_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const JOIN_ACTIVITY = 'JOIN_ACTIVITY';
export const QUIT_ACTIVITY = 'QUIT_ACTIVITY';
export const SET_ACTIVITIES = 'SET_ACTIVITIES';

export const fetchActivities = () => {
  return async (dispatch, getState) => {
    const uid = getState().user.userId;

    try {

      var url = new URL('http://192.168.1.7:5000/activity/all'),
          params = {uid: uid}
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

      const response = await fetch(url, {
        method: 'GET',
      });
      // const response = await fetch(
      //   'http://192.168.1.7:5000/activity/all'
      // );
      
      if (!response.ok) {
        throw new Error('Something goes wrong!');
      }

      const resData = await response.json();
      const loadedActivities = [];
      const loadedUserActivities = [];
      const loadedUserActivitiesId = new Set();
      for (const userActivity of resData['userActivities']) {
        loadedUserActivitiesId.add(userActivity.id);
      }
      
      for (const activity of resData['activities']) {
        // const aid = activity.id;
        loadedActivities.push(
          new Activity(
            activity.id,
            activity.ownerId,
            activity.title,
            activity.time,
            activity.location,
            activity.organizer,
            activity.participants,
            activity.description
          )
        );
      }
      for (let loadedActivity of loadedActivities) {
        if (loadedUserActivitiesId.has(loadedActivity.aid)) {
          loadedUserActivities.push(loadedActivity);
        }
      }
      dispatch({
        type: SET_ACTIVITIES, 
        activities: loadedActivities, 
        userActivities: loadedUserActivities
      });
    } catch (err) {
      throw err.message;
    }
  }; 
};

export const deleteActivity = (id) => {

  return async dispatch => {

    const response = await fetch('http://192.168.1.7:5000/activity/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
      })
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({ type: DELETE_ACTIVITY, aid: id });
  };
};

export const createActivity = (title, time, location, description) => {
  
  return async (dispatch, getState) => {

    const ownerId = getState().user.userId;
    const response = await fetch('http://192.168.1.7:5000/activity/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ownerId,
        title, 
        time, 
        location, 
        description
      })
    });
  
    const resData = await response.json();
    const createdActivity = resData['activity'];
    dispatch({
      type: CREATE_ACTIVITY,
      ActivityData: {
        aid: createdActivity['id'],
        ownerId: createdActivity['ownerId'],
        title: createdActivity['title'],
        time: createdActivity['time'],
        location: createdActivity['location'],
        organizer: createdActivity['organizer'],
        participants: createdActivity['participants'],
        description: createdActivity['description'],
      }
    });
  };
};

export const updateActivity = (id, title, time, location, description) => {
  return async dispatch => {
    const response = await fetch('http://192.168.1.7:5000/activity/edit', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        title, 
        time, 
        location, 
        description
      })
    });
    
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    const editdActivity = resData['activity'];

    dispatch({
      type: UPDATE_ACTIVITY,
      aid: id,
      ActivityData: {
        aid: editdActivity['id'],
        ownerId: editdActivity['ownerId'],
        title: editdActivity['title'],
        time: editdActivity['time'],
        location: editdActivity['location'],
        organizer: editdActivity['organizer'],
        participants: editdActivity['participants'],
        description: editdActivity['description'],
      }
    });
  };
};

export const joinActivity = (id) => {
  return async (dispatch, getState) => {

    const ownerId = getState().user.userId;
    const response = await fetch('http://192.168.1.7:5000/activity/join', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        ownerId,
      })
    });
  
    const resData = await response.json();
    const joinedActivity = resData['activity'];
    dispatch({
      type: JOIN_ACTIVITY,
      aid: id,
      ActivityData: {
        aid: joinedActivity['id'],
        ownerId: joinedActivity['ownerId'],
        title: joinedActivity['title'],
        time: joinedActivity['time'],
        location: joinedActivity['location'],
        organizer: joinedActivity['organizer'],
        participants: joinedActivity['participants'],
        description: joinedActivity['description'],
      }
    });
  };
};


export const quitActivity = (id) => {
  return async (dispatch, getState) => {

    const ownerId = getState().user.userId;
    const response = await fetch('http://192.168.1.7:5000/activity/quit', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        ownerId,
      })
    });
  
    const resData = await response.json();
    const quitedActivity = resData['activity'];
    dispatch({
      type: QUIT_ACTIVITY,
      aid: id,
      ActivityData: {
        aid: quitedActivity['id'],
        ownerId: quitedActivity['ownerId'],
        title: quitedActivity['title'],
        time: quitedActivity['time'],
        location: quitedActivity['location'],
        organizer: quitedActivity['organizer'],
        participants: quitedActivity['participants'],
        description: quitedActivity['description'],
      }
    });
  };
};
