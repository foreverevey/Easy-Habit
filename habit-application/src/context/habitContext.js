import createDataContext from './createDataContext';
import habitApi from '../api/habitApi';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';

const habitReducer = ( state, action ) => {
  switch (action.type){
    case 'get_habits':
      return action.payload;
    case 'add_habit':
      return [...state, action.payload];
    case 'delete_habit':
      var data = state.filter((habit) => habit._id !== action.payload);
      return data;
    case 'edit_habit':
      return [...state.map(habit => {
        if(habit._id === action.payload.id){
          return action.payload.habit
        } else {
          return habit;
        }
      })];
    case 'add_date':
      return [...state.map(habit => {
        if(habit._id === action.payload.id){
          return action.payload.habit
        } else {
          return habit;
        }
      })];
    case 'remove_date':
      return [...state.map(habit => {
        if(habit._id === action.payload.id){
          return action.payload.habit
        } else {
          return habit;
        }
      })];
    default:
      return state;
  }
};

const getHabits = dispatch => async () => {
  try{
    const response = await habitApi.get('/habits');
    dispatch({type: 'get_habits', payload: response.data});
    return true;
  } catch(error){
    return false;
  }
};

const addHabit = dispatch => async (name, private_bool, description, trackedDays) => {
  const response = await habitApi.post('/habits',
    {name, private_bool, description, trackedDays}
  );
  dispatch({type: 'add_habit', payload: response.data});
};

const deleteHabit = dispatch => async (id) => {
  const url = '/habit/' + id;
  try{
    await habitApi.delete(url, {id});
    dispatch({type: 'delete_habit', payload: id});
  } catch(error){
    return false;
  }
};

const editHabit = dispatch => async (id, name, private_bool, description, trackedDays) =>{
  try{
    const response = await habitApi.post('/habit/edit-habit', {id, name, private_bool, description, trackedDays});
    dispatch({type: 'edit_habit', payload: {id, habit: response.data}});
  } catch(error){
    return false;
  }
};

const addDateHabit = dispatch => async (id, formatedDate) => {
  try{
    const response = await habitApi.post('/habit/add-date', {id, date:formatedDate.toString()});
    dispatch({type: 'add_date', payload: {id, habit: response.data}})
  } catch(error){
    return false;
  }
};

const removeDateHabit = dispatch => async (id, date) => {
  try{
    const response = await habitApi.post('/habit/remove-date', {id, date});
    dispatch({type: 'remove_date', payload: {id, habit: response.data}})
  } catch(error){
    return false;
  }
};

export const { MyContext, Provider } = createDataContext(
  habitReducer,
  { getHabits, addHabit, deleteHabit, addDateHabit, removeDateHabit, editHabit},
  []);
