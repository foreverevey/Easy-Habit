import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {MaterialIcons} from '@expo/vector-icons';

const MyHeader = (navigation) => {
  return {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    title: 'Hi',
    headerRight: () => (
      <TouchableOpacity
        style={{padding:5, marginHorizontal:10}}
        onPress={()=>navigation.getParam('increaseCount')()}>

        <Text style={{color:"#FFFFFF"}}>
          Test count22
        </Text>

      </TouchableOpacity>
    ),
    headerTitle: () => (
      <TouchableOpacity
        onPress={()=>navigation.getParam('getDatePicker')()}>

        <Text style={{color:"#FFFFFF"}}>
          {navigation.getParam('selectedDay')}
        </Text>

      </TouchableOpacity>
    ),
    headerTitleAlign: 'center',
  };
};

export default MyHeader;
