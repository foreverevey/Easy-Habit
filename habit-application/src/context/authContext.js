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
    // REGISGER
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
    navigate('Home');
  } else {
    navigate('Signin');
  }
};

const signin = dispatch => {
  return async ({ email, password }) => {
    //make api request to sign up with that email and password
    try{
      const response = await habitApi.post('/signin', {email, password});
      // await AsyncStorage.setItem('isSignedIn', 'yes');
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', email);
      dispatch({ type: 'signin', payload: response.data.token});
      navigate('Home');
    }catch(err){
      console.log('signing error', err);
      dispatch({type: 'add_error', payload: 'Something Went wrong'});
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
      navigate('Home');
    }catch(err){
      dispatch({type: 'add_error', payload: 'Something Went wrong'});
    }
  };
};
//
// const signout = (dispatch) => {
//   return () =>{
//   };
// };

export const { MyContext , Provider} = createDataContext(
  authReducer,
  {signin, signup, tryLocalSignin},
  { token: null, errorMessage: ''}
);
