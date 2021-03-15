import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions } from 'react-native';
import { throttle } from "lodash";
import { FontAwesome } from '@expo/vector-icons';

const MyHeader = (navigation, language) => {

  const languageParam = navigation.getParam('language');

  if(languageParam !== undefined){
    language = languageParam;
  }

  const monthNamesLanguage = language.monthNames;

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const getDate = () => {
    const selectedDate = navigation.getParam('selectedDay');
    const day = new Date(selectedDate);
    const monthByLanguage = monthNamesLanguage[day.getMonth()];
    const dd = String(day.getDate()).padStart(2, '0');
    const yyyy = day.getFullYear();
    const formatedDate = monthByLanguage + '/' + dd + '/' + yyyy;
    if(selectedDate === undefined){
      return '';
    } else {
      return formatedDate;
    }
  };

  const monthName = getDate();
  const theme = navigation.getParam('theme');

  var themeOptions;
  if(theme !== undefined){
    themeOptions = theme.theme;
  }

  const navigateSettings = () => {
    navigation.navigate('Settings', {theme: themeOptions, language: language, flow: 'mainFlow'})
  }

  const navigateCreate = () => {
    navigation.navigate('Create', {theme: themeOptions, language: language})
  }

  const handlerSettings = throttle(navigateSettings, 500);
  const handlerCreate = throttle(navigateCreate, 500);

  return {
    headerStyle: {
      backgroundColor: themeOptions?themeOptions.headerBackground:'#ffaf7a',
      borderBottomColor: 'black',
      height: screenHeight * 0.15,
    },
    title: 'Hi',
    headerLeft: () => (
      <View style={styles.container}>
        {navigation.getParam('selectedHabit') === null && <TouchableOpacity
          style={{
            marginLeft:15,
            minWidth: screenWidth*0.15,
            minHeight: screenHeight * 0.10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={()=>handlerCreate()}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize:30}} name="plus"/>
        </TouchableOpacity>}
        {navigation.getParam('selectedHabit') !== null && <TouchableOpacity
          style={{marginLeft:30,}}
          onPress={()=>navigation.getParam('deleteHabit')(navigation.getParam('selectedHabit'))}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff',fontSize:30}} name="trash"/>
        </TouchableOpacity>}
      </View>
    ),
    headerRight: () => (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            marginRight:15,
            minWidth: screenWidth*0.15,
            minHeight: screenHeight * 0.10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={()=>handlerSettings()}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize:30}} name="cog"/>
        </TouchableOpacity>
      </View>
    ),
    headerTitle: () => (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonPrev}
          onPress={()=>navigation.getParam('selectPreviousDay')()}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize:24, textAlign:'right'}} name="caret-left"/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigation.getParam('getDatePicker')()}>
          <Text style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize: 20, marginLeft:10, marginRight:10}}>
            {monthName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNext}
          onPress={()=>navigation.getParam('selectNextDay')()}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize:24}} name="caret-right"/>
        </TouchableOpacity>
      </View>
    ),
    headerTitleAlign: 'center',
  };
};

const styles = StyleSheet.create({
  container:{
    justifyContent: 'space-around',
    display: 'flex',
    alignItems: "center",
    flexDirection: 'row',
  },
  buttonNext:{
    // borderWidth: 2,
    // borderColor: 'black',
    // borderStyle: 'solid',
    width:20,
  },
  buttonPrev:{
    // borderWidth: 2,
    // borderColor: 'black',
    // borderStyle: 'solid',
    width:20,
  }
})

export default MyHeader;
