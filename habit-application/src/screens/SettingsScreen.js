import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar,
  AsyncStorage} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import ButtonLogin from '../components/ButtonLogin';

const SettingsScreen = ({navigation}) =>{
  const {state, changeTheme} = useContext(ThemeContext);
  // const cleanTheme = state.name;
  const _changeThemeCheerful = () =>{
    console.log('changeThemeCheerful');
    if(state.theme.name === 'cheerful'){
      changeTheme('clean');
    } else {
      changeTheme('cheerful');
    }
  };

  const _changeThemeClean = () =>{
    if(state.theme.name === 'clean'){
      changeTheme('cheerful');
    } else {
      changeTheme('clean');
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

  return (
    <View style={styles(state.theme).container}>
      <ImageBackground source={{uri: state.theme.backgroundImage}} style={styles(state.theme).ImageBackground}>
        <Text style={styles(state.theme).Header}>Change Theme</Text>
        <ThemeSwitch Value={state.theme.name === 'cheerful'?true:false} OnValueChange={()=>{_changeThemeCheerful()}} Text='Cheerful'/>
        <ThemeSwitch Value={state.theme.name === 'clean'?true:false} OnValueChange={()=>{_changeThemeClean()}} Text='Clean'/>
        <ButtonLogin text='Logout' onPress={async()=>{
            await clearStorage();
            navigation.navigate('Signin');}
          }/>
      </ImageBackground>

    </View>
  )
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
  }
});

export default SettingsScreen;