import createDataContext from './createDataContext';
import habitApi from '../api/habitApi';
import {AsyncStorage} from 'react-native';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
  switch(action.type){
    case 'add_error':
      return {...state, errorMessage: action.payload}
    //LOGGING IN
    case 'signin':
      return {errorMessage: '', token: action.payload}
    // REGISTER
    case 'signup':
      return {errorMessage: '', token: action.payload}
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () =>{
  const token = await AsyncStorage.getItem('token');
  if(token){
    dispatch({ type: 'signin', payload: token});
    return true;
  } else {
    return false;
  }
};

const signin = dispatch => {
  return async ({ email, password }) => {
    //make api request to sign up with that email and password
    try{
      const response = await habitApi.post('/signin', {email, password});
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', email);
      dispatch({ type: 'signin', payload: response.data.token});
      return true
    }catch(err){
      dispatch({type: 'add_error', payload: 'Something Went wrong'});
      return false;
    }
  };
};
//
const signup = (dispatch) =>{
  return async ({email, password})=>{
    try{
      const response = await habitApi.post('signup', {email, password});
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', email);
      dispatch({type:'signup', payload: response.data.token});
      return true;
    }catch(err){
      dispatch({type: 'add_error', payload: 'Something Went wrong'});
      return false;
    }
  };
};


export const { MyContext , Provider} = createDataContext(
  authReducer,
  {signin, signup, tryLocalSignin},
  { token: null, errorMessage: ''}
);
