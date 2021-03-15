import createDataContext from './createDataContext';
import { AsyncStorage, Image } from 'react-native';
import { navigate } from '../navigationRef';
import translations from '../translation/Translations';

const languageReducer = (state, action) => {
  switch(action.type){
    case 'change_language':
      return {...state, language: action.payload}
    case 'change_showDays':
      return {...state, showNotChosenDays: action.payload}
    case 'change_longClick':
      return {...state, longClickHabit: action.payload}
    case 'load_settings':
      return {
        language: action.payload.language,
        showNotChosenDays: action.payload.showNotChosenDays,
        longClickHabit: action.payload.longClickHabit,
      }
    default:
      return state;
  }
};

const changeLongClick = dispatch => async (longClickHabit) =>{
  await AsyncStorage.setItem('longClickHabit', longClickHabit);
  dispatch({ type: 'change_longClick', payload: longClickHabit});
};

const changeShowDays = dispatch => async (showNotChosenDays) =>{
  await AsyncStorage.setItem('showNotChosenDays', showNotChosenDays);
  dispatch({ type: 'change_showDays', payload: showNotChosenDays});
};

const loadSettings = dispatch => async (language, showNotChosenDays, longClickHabit) => {
  if(language === null){
    language = 'English';
  };
  if(showNotChosenDays === null){
    showNotChosenDays = 'true';
  };
  if(longClickHabit === null){
    longClickHabit = 'true';
  };
  await AsyncStorage.setItem('language', language);
  await AsyncStorage.setItem('showNotChosenDays', showNotChosenDays);
  await AsyncStorage.setItem('longClickHabit', longClickHabit);
  dispatch({
    type: 'load_settings',
    payload: {
      language: translations[language],
      showNotChosenDays,
      longClickHabit
    }
  });
};

const changeLanguage = dispatch => async (language) =>{
  await AsyncStorage.setItem('language', language);
  dispatch({ type: 'change_language', payload: translations[language]});
  return translations[language];
};

export const { MyContext , Provider} = createDataContext(
  languageReducer,
  {changeLanguage, loadSettings, changeShowDays, changeLongClick},
  { language: translations['English'], showNotChosenDays: 'true', longClickHabit: 'false'}
);
