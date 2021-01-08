import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {MaterialIcons} from '@expo/vector-icons';

const MyHeader = (navigation) => {

  const theme = navigation.getParam('theme');
  var themeOptions;
  if(theme !== undefined){
    themeOptions = theme.theme;
  }

  return {
    headerStyle: {
      backgroundColor: themeOptions?themeOptions.pri1:'#ffaf7a',
      borderBottomColor: 'black',
      height:90,
    },
    title: 'Hi',
    // headerRight: () => (
    //   <TouchableOpacity
    //     style={{padding:5, marginHorizontal:10}}
    //     onPress={()=>navigation.getParam('increaseCount')()}>
    //
    //     <Text style={{color:"#FFFFFF"}}>
    //       Test count22
    //     </Text>
    //
    //   </TouchableOpacity>
    // ),
    headerTitle: () => (
      <TouchableOpacity
        onPress={()=>navigation.getParam('getDatePicker')()}>

        <Text style={{color:"#FFFFFF", fontSize: 18}}>
          {navigation.getParam('selectedDay')}
        </Text>

      </TouchableOpacity>
    ),
    headerTitleAlign: 'center',
  };
};

export default MyHeader;
