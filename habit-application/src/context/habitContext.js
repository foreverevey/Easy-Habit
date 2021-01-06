// import React, {useReducer} from 'react';
import createDataContext from './createDataContext';
import habitApi from '../api/habitApi';
import {AsyncStorage} from 'react-native';
import { navigate } from '../navigationRef';

const habitReducer = ( state, action ) => {
  switch (action.type){
    case 'get_habits':
      return {...state, data: action.payload};
    case 'add_habit':
      return {...state, data: action.payload};
    case 'delete_habit':
      var data = state.data.filter((habit) => habit._id !== action.payload);
      return {...state, data: data};
    case 'add_date':
      var data = state.data.map(habit => {
        if(habit._id === action.payload.id){
          return action.payload.habit
        } else {
          return habit;
        }
      });
      return {...state, data: data};
    case 'remove_date':
      var data = state.data.map(habit => {
        if(habit._id === action.payload.id){
          return action.payload.habit;
        } else {
          return habit;
        }
      });
      return {...state, data: data};
    case 'reload_state':
      var data = state.data;
      return action.payload;
    default:
      return state;
  }
};

//to fetch habits
const getHabits = dispatch => async () => {
  try{
    const response = await habitApi.get('/habits');
    console.log('getHabits', response.data);
    dispatch({type: 'get_habits', payload: response.data});
    return true;
  } catch(error){
    console.log('Error in HabitContext getHabits', error);
    return true;
  }

};

//to add habits
const addHabit = dispatch => async (name, private_bool, description) => {
  const response = await habitApi.post('/habits',
    {name, private_bool, description}
  );
  dispatch({type: 'add_habit', payload: response.data});
};

const deleteHabit = dispatch => async (id) => {
  const url = '/habit/' + id;
  try{
    await habitApi.delete(url, {id});
    dispatch({type: 'delete_habit', payload: id});
  } catch(error){
    console.log('fail delete habit', error.message);
  }
};

const addDateHabit = dispatch => async (id, formatedDate) => {
  try{
    console.log('addDateHabit', id, formatedDate);
    const response = await habitApi.post('/habit/add-date', {id, date:formatedDate.toString()});
    console.log('response answer add date', response);
    dispatch({type: 'add_date', payload: {id, habit: response.data}})
  } catch(error){
    console.log('Failed to add date', error.message);
  }
};

const removeDateHabit = dispatch => async (id, date) => {
  try{
    const response = await habitApi.post('/habit/remove-date', {id, date});
    console.log('removeDateHabit', response.data);
    dispatch({type: 'remove_date', payload: {id, habit: response.data}})
  } catch(error){
    console.log('Failed to remove date', error.message);
  }
};

const reloadState = dispatch => async (reload, data) => {
  console.log('reload state?', reload);
  dispatch({type: 'reload_state', payload: {reload, data}});
  return true;
};

export const { MyContext, Provider } = createDataContext(
  habitReducer,
  { getHabits, addHabit, deleteHabit, addDateHabit, removeDateHabit, reloadState},
  { data: [], reload: false});
