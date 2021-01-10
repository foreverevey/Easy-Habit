import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const MyHeader = (navigation) => {

  const theme = navigation.getParam('theme');
  var themeOptions;
  if(theme !== undefined){
    themeOptions = theme.theme;
  }
  // navigation.getParam('newHabit')()
  return {
    headerStyle: {
      backgroundColor: themeOptions?themeOptions.pri1:'#ffaf7a',
      borderBottomColor: 'black',
      height:90,
    },
    title: 'Hi',
    headerRight: () => (
      <View style={styles.container}>
        <TouchableOpacity
          style={{marginRight:20,}}
          onPress={()=>navigation.navigate('Create')}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff',fontSize:30}} name="plus"/>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginRight:15,}}
          onPress={()=>navigation.getParam('getSettingsPicker')()}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff',fontSize:30}} name="ellipsis-v"/>
        </TouchableOpacity>
      </View>
    ),
    headerTitle: () => (
      <TouchableOpacity
        onPress={()=>navigation.getParam('getDatePicker')()}>
        <Text style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize: 22}}>
          {navigation.getParam('selectedDay')}
        </Text>
      </TouchableOpacity>
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
})

export default MyHeader;
