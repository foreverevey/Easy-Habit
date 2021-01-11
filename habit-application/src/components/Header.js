import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const MyHeader = (navigation) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getDate = () => {
    const selectedDate = navigation.getParam('selectedDay');
    const day = new Date(selectedDate);
    const monthName = monthNames[day.getMonth()];
    const dd = String(day.getDate()).padStart(2, '0');
    const yyyy = day.getFullYear();
    const formatedDate = monthName + '/' + dd + '/' + yyyy;
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
  // navigation.getParam('newHabit')()
  // visible={navigation.getParam('showDeleteHabit')}
  return {
    headerStyle: {
      backgroundColor: themeOptions?themeOptions.pri1:'#ffaf7a',
      borderBottomColor: 'black',
      height:90,
    },
    title: 'Hi',
    headerLeft: () => (
      <View style={styles.container}>
        {navigation.getParam('selectedHabit') === null && <TouchableOpacity
          style={{marginLeft:30,}}
          onPress={()=>navigation.navigate('Create')}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff',fontSize:30}} name="plus"/>
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
          style={{marginRight:30}}
          onPress={()=>navigation.navigate('Settings')}>
          <FontAwesome style={{color:themeOptions?themeOptions.headerPlus:'#fff',fontSize:30}} name="cog"/>
        </TouchableOpacity>
      </View>
    ),
    headerTitle: () => (
      <TouchableOpacity
        onPress={()=>navigation.getParam('getDatePicker')()}>
        <Text style={{color:themeOptions?themeOptions.headerPlus:'#fff', fontSize: 18}}>
          {monthName}
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
