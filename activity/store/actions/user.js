export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const signup = (username, firstName, lastName, password) => {
  return async dispatch => {
    const response = await fetch('http://192.168.1.7:5000/user/sign_up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        firstName, 
        lastName, 
        password, 
      })
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();

    dispatch({ 
      type: SIGNUP, 
      token: resData.token, 
      userId: resData.uid,
      username: resData.username,
      firstName: resData.firstName,
      lastName: resData.lastName
    });
  };
};


export const logIn = (username, password) => {
  return async dispatch => {

    var url = new URL("http://192.168.1.7:5000/user/log_in"),
        params = {username: username, password: password}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    dispatch({ 
      type: SIGNUP, 
      token: resData.token, 
      userId: resData.uid,
      username: resData.username,
      firstName: resData.firstName,
      lastName: resData.lastName
    });
  };
};


export const logOut = () => {
  return { type: LOGOUT }
};