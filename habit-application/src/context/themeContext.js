import createDataContext from './createDataContext';
import {AsyncStorage, Image} from 'react-native';
import { navigate } from '../navigationRef';
import cleanBackground from '../../assets/cleanBackground.png';
import cheerfulBackground from '../../assets/cheerfulBackground.png';

const cleanBackgroundUri = Image.resolveAssetSource(cleanBackground).uri
const cheerfulBackgroundUri = Image.resolveAssetSource(cheerfulBackground).uri

const themeOptions = {
  'clean': {
    pri1: '#5680e8',
    pri2: '#84ceeb',
    pri3: '#5ab9ea',
    sec1: '#c1c8e4',
    sec2: '#8860d0',
    white: '#fff',
    headerPlus: '#fff',
    backgroundImage: cleanBackgroundUri,
    name: 'clean',
    button: '#8860d0',
    sliderThumbOn: '#5680e8',
    sliderTrackOn: '#8860d0',
    sliderThumbOff: '#84ceeb',
    sliderTrackOff: '#8860d0',
    text: '#fff',
    check: '#5680e8',
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
    sliderThumbOn: '#f4976c',
    sliderTrackOn: '#303c6c',
    sliderThumbOff: '#b4dfe5',
    sliderTrackOff: '#8860d0',
    text: '#303c6c',
    check: '#f4976c',
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
  { theme: themeOptions['cheerful']}
);
