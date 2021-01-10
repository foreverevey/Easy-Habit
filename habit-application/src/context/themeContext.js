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
      pri1: '#8b97dc',
      pri2: '#00b25c',
      pri3: '#009145',
      sec1: '#007f39',
      sec2: '#ffb5a6',
      white: '#fff',
      backgroundImage: cheerfulBackgroundUri,
    }}
);
