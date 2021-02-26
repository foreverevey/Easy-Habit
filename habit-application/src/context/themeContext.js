import createDataContext from './createDataContext';
import {AsyncStorage, Image} from 'react-native';
import { navigate } from '../navigationRef';
import cleanBackground from '../../assets/cleanBackground.png';
import cheerfulBackground from '../../assets/cheerfulBackground.png';
import darkBackground from '../../assets/darkBackground.png';
import cleanBackground2 from '../../assets/cleanBackground2.png';

const cleanBackgroundUri = Image.resolveAssetSource(cleanBackground).uri
const cheerfulBackgroundUri = Image.resolveAssetSource(cheerfulBackground).uri
const darkBackgroundUri = Image.resolveAssetSource(darkBackground).uri
const cleanBackground2Uri = Image.resolveAssetSource(cleanBackground2).uri

const themeOptions = {
  'clean': {
    pri1: '#5680e8',
    pri2: '#84ceeb',
    pri3: '#5ab9ea',
    sec1: '#c1c8e4',
    sec2: '#8860d0',
    white: '#fff',
    headerPlus: '#a0e6f2',
    backgroundImage: cleanBackground2Uri,
    name: 'clean',
    button: '#a0e6f2',
    sliderThumbOn: '#e91e63',
    sliderTrackOn: '#272b36',
    sliderThumbOff: '#272b36',
    sliderTrackOff: '#e91e63',
    text: '#fff',
    buttonText: '#051e22',
    placeholderText: '#d4d4d3',
    placeholderTextInBox: '#051e22',
    checkPlus: '#e91e63',
    check: '#051e22',
    streak: '#e91e63',
    headerBackground: '#051e22',
    habitRowBackground: '#a0e6f2',
    chartBackground: '#04505d',
    chartRgba: '160, 230, 242',
    calendarText: '#b4dfe5',
    calendarBackground: '#04505d',
    errModalBackground: 'black',
    errModalText: 'white',
  },
  'cheerful': {
    pri1: '#fbe8a6',
    pri2: '#f4976c',
    pri3: '#303c6c',
    sec1: '#b4dfe5',
    sec2: '#d2fdff',
    white: '#fff',
    headerPlus: '#303C6C',
    backgroundImage: cheerfulBackgroundUri,
    name: 'cheerful',
    button: '#303c6c',
    sliderThumbOn: '#fbe8a6',
    sliderTrackOn: '#f4976c',
    sliderThumbOff: '#f4976c',
    sliderTrackOff: '#fbe8a6',
    text: '#303c6c',
    buttonText: '#fff',
    placeholderText: '#555251',
    placeholderTextInBox: '#bebebd',
    checkPlus: '#e91e63',
    check: '#b4dfe5',
    streak: '#f58a42',
    headerBackground: '#f4976c',
    habitRowBackground: '#303C6C',
    chartBackground: '#303c6c',
    chartRgba: '180, 223, 229',
    calendarText: '#b4dfe5',
    calendarBackground: '#303c6c',
    errModalBackground: 'black',
    errModalText: 'white',
  },
  'dark': {
    pri1: '#272b36',
    pri2: '#f4976c',
    pri3: '#303c6c',
    sec1: '#b4dfe5',
    sec2: '#d2fdff',
    white: '#fff',
    headerPlus: '#fff',
    backgroundImage: darkBackgroundUri,
    name: 'dark',
    button: '#777e86',
    sliderThumbOn: '#e91e63',
    sliderTrackOn: '#272b36',
    sliderThumbOff: '#272b36',
    sliderTrackOff: '#e91e63',
    text: '#cfd8dd',
    buttonText: '#cfd8dd',
    placeholderText: '#d4d4d3',
    placeholderTextInBox: '#bebebd',
    checkPlus: '#e91e63',
    check: '#272b36',
    streak: '#e91e63',
    headerBackground: '#181d20',
    habitRowBackground: '#777e86',
    chartBackground: '#181d20',
    chartRgba: '233, 30, 99',
    calendarText: '#e91e63',
    calendarBackground: '#181d20',
    errModalBackground: 'black',
    errModalText: 'white',
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
  await AsyncStorage.setItem('theme', theme);
  dispatch({ type: 'change_theme', payload: themeOptions[theme]});
};

export const { MyContext , Provider} = createDataContext(
  themeReducer,
  {changeTheme},
  { theme: themeOptions['cheerful']}
);
