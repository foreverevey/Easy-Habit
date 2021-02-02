import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar,
  AsyncStorage, Picker} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';
import ThemeSwitch from '../components/ThemeSwitch';
import ButtonLogin from '../components/ButtonLogin';
import MyHeaderSecondary from '../components/HeaderSecondary';
import habitApi from '../api/habitApi';
import LineButton from '../components/LineButton';
import CustomModal from '../components/CustomModal';
import Spacer from '../components/Spacer';
import translations from '../translation/Translations';

const SettingsScreen = ({navigation}) =>{
  const {state, changeTheme} = useContext(ThemeContext);
  const [bugModal, setBugModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const languageContext = useContext(LanguageContext);

  const _changeThemeCheerful = () =>{
    console.log('changeThemeCheerful', state.theme.name);
    if(state.theme.name === 'cheerful'){
      changeTheme('clean');
    } else {
      changeTheme('cheerful');
    }
  };

  const _changeThemeClean = () =>{
    console.log('changeThemeClean', state.theme.name);
    if(state.theme.name === 'clean'){
      changeTheme('cheerful');
    } else {
      changeTheme('clean');
    }
  };

  const _changeThemeDark = () =>{
    console.log('changeThemeDark', state.theme.name);
    if(state.theme.name === 'dark'){
      changeTheme('cheerful');
    } else {
      changeTheme('dark');
    }
  };

  const clearStorage = async () => {
    try{
      await AsyncStorage.removeItem('token');
      const item = await AsyncStorage.getItem('token');
      return true;
    } catch(error){
      console.log(error);
      return false;
    }
  };

  const sendEmail = async (body, subject) =>{
    try{
      const to = "patkppDev@gmail.com";
      const from = "patkppDev@gmail.com";
      const response = await habitApi.post('/email',
        {to, from, body, subject}
      );
    } catch(error){
      console.log('sendEmail error', error);
    }
  };

  const openModal = (modalType) => {
    if(modalType === 'bug'){
      setBugModal(true);
    };
    if(modalType === 'feedback'){
      setFeedbackModal(true);
    };
  };

  useEffect(() => {
    navigation.setParams({ theme: state.theme });
  }, [state]);

  useEffect(() => {
    navigation.setParams({ language: languageContext.state.language });
  }, [languageContext.state]);

  return (
    <View style={styles(state.theme).container}>
      <ImageBackground source={{uri: state.theme.backgroundImage}} style={styles(state.theme).ImageBackground}>
        <CustomModal isVisible={bugModal} type='bug' title={languageContext.state.language.bugModalTitle} onPressOutside={()=>setBugModal(!bugModal)} sendEmail={sendEmail}/>
        <CustomModal isVisible={feedbackModal} type='feedback' title={languageContext.state.language.feedbackModalTitle} onPressOutside={()=>setFeedbackModal(!feedbackModal)} sendEmail={sendEmail}/>
        <Text style={styles(state.theme).Header}>{languageContext.state.language.themeOptions}</Text>
        <ThemeSwitch Value={state.theme.name === 'cheerful'?true:false} OnValueChange={()=>{_changeThemeCheerful()}} Text={languageContext.state.language.cheerful}/>
        <ThemeSwitch Value={state.theme.name === 'clean'?true:false} OnValueChange={()=>{_changeThemeClean()}} Text={languageContext.state.language.clean}/>
        <ThemeSwitch Value={state.theme.name === 'dark'?true:false} OnValueChange={()=>{_changeThemeDark()}} Text={languageContext.state.language.dark}/>
        <Spacer/>
        <LineButton text={languageContext.state.language.bugReportText} onPress={()=>openModal('bug')} type='bug'/>
        <LineButton text={languageContext.state.language.feedbackSimpleText} onPress={()=>openModal('feedback')} type='paper-plane'/>
        <Picker
          selectedValue={languageContext.state.language.label}
          onValueChange={(itemValue, itemIndex) => languageContext.changeLanguage(itemValue)}>
          {Object.keys(translations).map((langItem) => {
            return <Picker.Item key={langItem} value={langItem} label={translations[langItem].label}/>
          })}
        </Picker>
        <ButtonLogin style={styles(state.theme).ButtonSave} text={languageContext.state.language.logout} onPress={async()=>{
            await clearStorage();
            navigation.navigate('Signin');}
          }/>
      </ImageBackground>

    </View>
  )
};
// {translations.map((languageItem, i) => {
//   return <Picker.Item key={i} value={languageItem.label} label={languageItem.label}/>
// })}
// <ButtonLogin style={styles(state.theme).ButtonSave} text='Test Email' onPress={()=>sendEmail()}/>

SettingsScreen.navigationOptions = ({navigation}) => {
  const text = 'Settings';
  const { params } = navigation.state;
  const theme = params.theme;
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
};

const styles = (props) =>StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'space-around',
  },
  ImageBackground:{
    flex: 1,
  },
  Header:{
    fontSize: 18,
    margin: 10,
    marginLeft: 20,
    alignSelf: 'center',
    color: props.headerPlus,
  },
  ButtonSave:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
