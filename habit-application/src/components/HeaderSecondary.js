import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const MyHeaderSecondary = (navigation, text, theme) => {

  const screenHeight = Dimensions.get('window').height;
  const themeParam = navigation.getParam('theme');
  const edit = navigation.getParam('edit');

  var editValue;
  if(edit !== undefined){
    editValue = edit;
  }

  if(themeParam !== undefined){
    theme = themeParam;
  };

  if(text === 'Habit details'){
    return {
      headerStyle: {
        backgroundColor: theme.headerBackground,
        borderBottomColor: 'black',
        height: screenHeight * 0.15,
      },
      title: 'Hi',
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
            onPress={()=>navigation.getParam('editHabit')()}>
            <FontAwesome style={{color:theme.headerPlus,fontSize:30}} name={editValue?"times":"edit"}/>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <View style={styles.container}>
          <Text style={{color:theme.headerPlus,fontSize:30}}>{text}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    };
  } else {
    return {
      headerStyle: {
        backgroundColor: theme.headerBackground,
        borderBottomColor: 'black',
        height: screenHeight * 0.15,
      },
      title: 'Hi',
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
          <Text style={{color:theme.headerPlus,fontSize:30}}>{text}</Text>
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
