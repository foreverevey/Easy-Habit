import createDataContext from './createDataContext';
import {AsyncStorage, Image} from 'react-native';
import { navigate } from '../navigationRef';
import translations from '../translation/Translations';

const languageReducer = (state, action) => {
  switch(action.type){
    case 'change_language':
      return {language: action.payload}
    default:
      return state;
  }
};

const changeLanguage = dispatch => async (language) =>{
  await AsyncStorage.setItem('language', language);
  dispatch({ type: 'change_language', payload: translations[language]});
};

export const { MyContext , Provider} = createDataContext(
  languageReducer,
  {changeLanguage},
  { language: translations['English']}
);
