// import React, {useReducer} from 'react';
import createDataContext from './createDataContext';
import habitApi from '../api/habitApi';
import {AsyncStorage} from 'react-native';
import { navigate } from '../navigationRef';

const habitReducer = ( state, action ) => {
  switch (action.type){
    case 'get_habits':
      return action.payload
    case 'add_habit':
      return [...state, action.payload];
    case 'delete_habit':
      return state.filter((habit) => habit._id !== action.payload);
    case 'add_date':
      return state.map(habit => {
        if(habit._id === action.payload){
          return action.payload.habit
        } else {
          return habit;
        }
      });
    case 'remove_date':
      return state.map(habit => {
        if(habit._id === action.payload){
          return action.payload.habit;
        } else {
          return habit;
        }
      });
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
    console.log('fail delete habit', error);
  }
};

const addDateHabit = dispatch => async (id, formatedDate) => {
  try{
    console.log('addDateHabit', id, formatedDate);
    const response = await habitApi.post('/habit/add-date', {id, date:formatedDate.toString()});
    dispatch({type: 'add_date', payload: {id, habit: response.data}})
  } catch(error){
    console.log('Failed to add date', error);
  }
};

const removeDateHabit = dispatch => async (id, date) => {
  try{
    const response = await habitApi.post('/habit/remove-date', {id, date});
    dispatch({type: 'remove_date', payload: {id, habit: response.data}})
  } catch(error){
    console.log('Failed to remove date', error);
  }
};

export const { MyContext, Provider } = createDataContext(
  habitReducer,
  { getHabits, addHabit, deleteHabit, addDateHabit, removeDateHabit },
  []);
