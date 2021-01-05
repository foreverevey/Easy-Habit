import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
import { MyContext as HabitContext } from '../context/habitContext';
import habitApi from '../api/habitApi';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const HabitDetailScreen = ({navigation}) => {
  const {state} = useContext(HabitContext);
  const id = navigation.getParam('item');
  const test = navigation.getParam('test');

  const [result, setResult] = useState({});
  const [dates, setDates] = useState({});



  const getData = (test) =>{
    setResult(test);
    const formatDates = test.dates;
    var datesArray = [];
    formatDates.forEach(date=>{
      const newDate = new Date(date.date);
      date.date = newDate.getFullYear()+'-' + ('0' + (newDate.getMonth()+1)).slice(-2) + '-'+ ('0' + newDate.getDate()).slice(-2);
      datesArray.push(newDate);
    });
    var markedDates = datesArray.reduce((c, v) => Object.assign(c, {[v]: {selected: true,marked: true,textColor: 'gray'}}), {});
    datesArray.sort((a, b) => a - b);
    var markedDates = getCalendarDates(datesArray);
    setDates(markedDates);
  };

  const getCalendarDates = (datesArray) =>{
    var markedDates = {};
    var startingDay = {startingDay: true, selected: true, marked: true, textColor: 'gray', color: 'green'};
    var endingDay = {endingDay: true, selected: true, marked: true, textColor: 'gray', color: 'green'};
    var middleDay = {selected: true, marked: true, textColor: 'gray', color: 'green'};
    for ( var i=0; i<datesArray.length; i++){
      console.log('getCalendarDates', datesArray[i]);
      var formatedDate = datesArray[i].getFullYear()+'-' + ('0' + (datesArray[i].getMonth()+1)).slice(-2) + '-'+ ('0' + datesArray[i].getDate()).slice(-2);
      if(i===0){
        markedDates[formatedDate] = startingDay;
      } else {
        var previous = datesArray[i-1];
        var current = datesArray[i];
        var next = datesArray[i+1];
        if(next===undefined){
          // means its last one
          markedDates[formatedDate] = endingDay;
        } else {
          const diffTimePrev = Math.abs(current - previous);
          const diffDaysPrev = Math.ceil(diffTimePrev / (1000 * 60 * 60 * 24));
          const diffTimeNext = Math.abs(next - current);
          const diffDaysNext = Math.ceil(diffTimeNext / (1000 * 60 * 60 * 24));
          if(diffDaysPrev === 1 && diffDaysNext !== 1){
            markedDates[formatedDate] = endingDay;
          };
          if(diffDaysPrev === 1 && diffDaysNext === 1){
            markedDates[formatedDate] = middleDay;
          };
          if(diffDaysPrev !== 1 && diffDaysNext === 1){
            markedDates[formatedDate] = startingDay;
          };
          if(diffDaysPrev !== 1 && diffDaysNext !== 1){
            markedDates[formatedDate] = startingDay;
          };
        }
      };
    }
    console.log('generated marked dates', markedDates);
    return markedDates;
  };

  useEffect(()=>{
    console.log('Habit detail screen state', result);
  }, [result]);

  useEffect(()=>{
    // getResult(id);
    getData(test);
  }, []);

  return(
    <View style={styles.container}>
      <Text>HabitDetailScreen</Text>
      <Text>{result?result.name:''}</Text>
      <Text>{id}</Text>
        <Calendar
        markedDates={dates}
        onDayLongPress={(day) => {console.log('selected day', day)}}
        markingType={'period'}
      />
    </View>
  )
}

// {
//   '2020-12-20': {textColor: 'green'},
//   '2020-12-22': {startingDay: true, color: 'green'},
//   '2020-12-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
//   '2020-12-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
// }


// HabitDetailScreen.navigationOptions = () => {
//   return {
//     // headerShown: false
//   };
// };

const styles = StyleSheet.create({
  container:{
    justifyContent: 'space-around',
    // alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  flatList:{
    marginHorizontal: 10,
    marginTop:25,
  },
})

export default HabitDetailScreen;
