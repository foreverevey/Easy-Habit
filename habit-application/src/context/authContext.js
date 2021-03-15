import createDataContext from './createDataContext';
import habitApi from '../api/habitApi';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
  switch(action.type){
    case 'add_error':
      return {...state, errorMessage: action.payload}
    case 'signin':
      return {errorMessage: '', token: action.payload}
    case 'signup':
      return {errorMessage: '', token: action.payload}
    case 'forgot':
      return state
    case 'submit':
      return state
    case 'change':
      return state
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
      const response = await habitApi.post('/signup', {email, password});
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

const forgotPassword = (dispatch) => async ({email}) => {
  try{
    const response = await habitApi.post('/signin/forgot', {email});
    dispatch({type:'forgot', payload: null});
    return true;
  }catch(err){
    dispatch({type: 'add_error', payload: err.response.data.error});
    return false;
  }
};

const submitCode = (dispatch) => {
  return async ({email, code})=>{
    try{
      const response = await habitApi.post('/signin/submit', {email, code});
      dispatch({type:'submit', payload: null});
      return true;
    }catch(err){
      dispatch({type: 'add_error', payload: err.response.data.error});
      return false;
    }
  };
};

const submitPassword = (dispatch) => {
  return async ({email, password})=>{
    try{
      const response = await habitApi.post('/signin/change', {email, password});
      dispatch({type:'change', payload: null});
      return true;
    }catch(err){
      dispatch({type: 'add_error', payload: err.response.data.error});
      return false;
    }
  };
};


export const { MyContext , Provider} = createDataContext(
  authReducer,
  { signin, signup, tryLocalSignin, forgotPassword, submitCode, submitPassword },
  { token: null, errorMessage: ''}
);
