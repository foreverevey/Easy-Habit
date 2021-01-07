import createDataContext from './createDataContext';
import {AsyncStorage} from 'react-native';
import { navigate } from '../navigationRef';

const themeOptions = {
  '#2fbe74': {
    pri50: '#e4f6eb',
    pri500: '#00b25c',
    pri700: '#009145',
    pri800: '#007f39',
    sec700: '#be2f79',
    sec900: '#802764',
  },
  '#8b50da': {
    pri50: '#f0e7fa',
    pri500: '#752dd3',
    pri700: '#5d1ec4',
    pri800: '#4f17bd',
    sec700: '#679f00',
    sec900: '#256b00',
  },
};

const themeReducer = (state, action) => {
  switch(action.type){
    case 'change_theme':
      return {theme: action.payload}
    default:
      return state;
  }
};

const changeTheme = dispatch => async (theme) =>{
  console.log('changeTheme', theme, themeOptions[theme]);
  await AsyncStorage.setItem('theme', theme);
  dispatch({ type: 'change_theme', payload: themeOptions[theme]});
};

export const { MyContext , Provider} = createDataContext(
  themeReducer,
  {changeTheme},
  { theme: {
      pri50: '#8b97dc',
      pri500: '#00b25c',
      pri700: '#009145',
      pri800: '#007f39',
      sec700: '#ffb5a6',
      sec900: '#802764',
    }}
);
