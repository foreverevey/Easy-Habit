import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar,
  AsyncStorage} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import ButtonLogin from '../components/ButtonLogin';
import MyHeaderSecondary from '../components/HeaderSecondary';
import habitApi from '../api/habitApi';
import LineButton from '../components/LineButton';
import CustomModal from '../components/CustomModal';
import Spacer from '../components/Spacer';

const SettingsScreen = ({navigation}) =>{
  const {state, changeTheme} = useContext(ThemeContext);
  const [bugModal, setBugModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

  // const cleanTheme = state.name;
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
      console.log('test sendemail click', body, subject);
      const to = "patkppDev@gmail.com";
      const from = "patkppDev@gmail.com";
      // const body = "test message HELOOOOOO";
      // const subject = "test subject";
      const response = await habitApi.post('/email',
        {to, from, body, subject}
      );
      // console.log(response);
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

  return (
    <View style={styles(state.theme).container}>
      <ImageBackground source={{uri: state.theme.backgroundImage}} style={styles(state.theme).ImageBackground}>
        <CustomModal isVisible={bugModal} type='bug' title='Report a Bug!' onPressOutside={()=>setBugModal(!bugModal)} sendEmail={sendEmail}/>
        <CustomModal isVisible={feedbackModal} type='feedback' title='Provide your feedback!' onPressOutside={()=>setFeedbackModal(!feedbackModal)} sendEmail={sendEmail}/>
        <Text style={styles(state.theme).Header}>Theme Options</Text>
        <ThemeSwitch Value={state.theme.name === 'cheerful'?true:false} OnValueChange={()=>{_changeThemeCheerful()}} Text='Cheerful'/>
        <ThemeSwitch Value={state.theme.name === 'clean'?true:false} OnValueChange={()=>{_changeThemeClean()}} Text='Clean'/>
        <ThemeSwitch Value={state.theme.name === 'dark'?true:false} OnValueChange={()=>{_changeThemeDark()}} Text='Dark'/>
        <Spacer/>
        <LineButton text="Report a Bug" onPress={()=>openModal('bug')} type='bug'/>
        <LineButton text="Give us Feedback!" onPress={()=>openModal('feedback')} type='paper-plane'/>
        <ButtonLogin style={styles(state.theme).ButtonSave} text='Logout' onPress={async()=>{
            await clearStorage();
            navigation.navigate('Signin');}
          }/>
      </ImageBackground>

    </View>
  )
};
// <ButtonLogin style={styles(state.theme).ButtonSave} text='Test Email' onPress={()=>sendEmail()}/>

SettingsScreen.navigationOptions = ({navigation}) => {
  const text = 'Settings';
  const { params } = navigation.state;
  const theme = params.theme;
  return MyHeaderSecondary(navigation, text, theme);
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
