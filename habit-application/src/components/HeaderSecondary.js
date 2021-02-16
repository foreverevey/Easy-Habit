import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import { debounce } from "lodash";
import { throttle } from "lodash";
import {FontAwesome} from '@expo/vector-icons';

const MyHeaderSecondary = (navigation, text, theme, language) => {

  const screenHeight = Dimensions.get('window').height;
  const themeParam = navigation.getParam('theme');
  const languageParam = navigation.getParam('language');
  const edit = navigation.getParam('edit');

  var editValue;
  if(edit !== undefined){
    editValue = edit;
  }

  if(themeParam !== undefined){
    theme = themeParam;
  };

  if(languageParam !== undefined){
    language = languageParam;
  };

  const editNav = () =>{
    navigation.getParam('editHabit')()
  }

  const handlerEdit = throttle(editNav, 500);

  if(text === 'Habit details'){
    return {
      headerStyle: {
        backgroundColor: theme.headerBackground,
        borderBottomColor: 'black',
        height: screenHeight * 0.15,
      },
      headerLeft: () => (
        <View style={styles.container}>
          <TouchableOpacity
            style={{alignItems: 'center', marginLeft:10, width:60, textAlign:'center', textAlignVertical:'center'}}
            onPress={()=>navigation.goBack()}>
            <FontAwesome style={{color:theme.headerPlus,fontSize:30}} name="angle-left"/>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={styles.container}>
          <TouchableOpacity
            style={{marginRight:30}}
            onPress={()=>handlerEdit()}>
            <FontAwesome style={{color:theme.headerPlus,fontSize:30}} name={editValue?"times":"edit"}/>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <View style={styles.container}>
          <Text style={{color:theme.headerPlus,fontSize:30}}>{language.detailScreenHeaderText}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    };
  } else if(text === 'Settings') {
    return {
      headerStyle: {
        backgroundColor: theme.headerBackground,
        borderBottomColor: 'black',
        height: screenHeight * 0.15,
      },
      headerLeft: () => (
        <View style={styles.container}>
          <TouchableOpacity
            style={{alignItems: 'center', marginLeft:10, width:60, textAlign:'center', textAlignVertical:'center'}}
            onPress={()=>navigation.goBack()}>
            <FontAwesome style={{color:theme.headerPlus,fontSize:30}} name="angle-left"/>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <View style={styles.container}>
          <Text style={{color:theme.headerPlus,fontSize:30}}>{language.settingScreenHeaderText}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    };
  } else if(text === 'Create Habit'){
    return {
      headerStyle: {
        backgroundColor: theme.headerBackground,
        borderBottomColor: 'black',
        height: screenHeight * 0.15,
      },
      headerLeft: () => (
        <View style={styles.container}>
          <TouchableOpacity
            style={{alignItems: 'center', marginLeft:10, width:60, textAlign:'center', textAlignVertical:'center'}}
            onPress={()=>navigation.goBack()}>
            <FontAwesome style={{color:theme.headerPlus,fontSize:30}} name="angle-left"/>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <View style={styles.container}>
          <Text style={{color:theme.headerPlus,fontSize:30}}>{language.createScreenHeaderText}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    };
  }

};

const styles = StyleSheet.create({
  container:{
    justifyContent: 'space-around',
    display: 'flex',
    alignItems: "center",
    flexDirection: 'row',
  },
})

export default MyHeaderSecondary;
