import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, AsyncStorage, ScrollView } from 'react-native';
import { MyContext as HabitContext } from '../context/habitContext';
import habitApi from '../api/habitApi';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {ContributionGraph} from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import {MyContext as ThemeContext} from '../context/themeContext';
import moment from 'moment';

const HabitDetailScreen = ({navigation}) => {
  const {state} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const id = navigation.getParam('item');
  const data = navigation.getParam('data');
  const screenWidth = Dimensions.get("window").width;
  const [result, setResult] = useState(data);

  const getData = (data) =>{
    const formatDates = data.dates;
    var datesArray = [];
    formatDates.forEach(date=>{
      const newDate = new Date(date.date);
      date.date = newDate.getFullYear()+'-' + ('0' + (newDate.getMonth()+1)).slice(-2) + '-'+ ('0' + newDate.getDate()).slice(-2);
      datesArray.push(newDate);
    });
    var markedDates = datesArray.reduce((c, v) => Object.assign(c, {[v]: {selected: true,marked: true,textColor: 'gray'}}), {});
    datesArray.sort((a, b) => a - b);
    var markedDates = getMarkedDates(datesArray);
    var contributionDays = getContributionGraphDays(datesArray);
    var [longestStreak, currentStreak] = getStreak(datesArray);
    console.log('streaks', longestStreak, currentStreak);
    return [markedDates, contributionDays, longestStreak, currentStreak];
  };

  const getMarkedDates = (datesArray) =>{
    var markedDates = {};
    var startingDay = {startingDay: true, selected: true, marked: true, textColor: 'gray', color: 'green'};
    var endingDay = {endingDay: true, selected: true, marked: true, textColor: 'gray', color: 'green'};
    var middleDay = {selected: true, marked: true, textColor: 'gray', color: 'green'};
    for ( var i=0; i < datesArray.length; i++){
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
        };
      };
    };
    return markedDates;
  };

  const getContributionGraphDays = (datesArray) =>{
    const ContributionGraphDays = [];
    for ( var i=0; i < datesArray.length; i++){
      var formatedDate = datesArray[i].getFullYear()+'-' + ('0' + (datesArray[i].getMonth()+1)).slice(-2) + '-'+ ('0' + datesArray[i].getDate()).slice(-2);
      ContributionGraphDays.push({'date': formatedDate, 'count': 3})
    };
    // Doing this because setting all days with count 1 throws error in color function regarding opacity
    ContributionGraphDays.push({'date': "2019-01-01", 'count': 1});
    return ContributionGraphDays;
  };

  const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  };

  const convertDateToUTC = (date) => {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  const getStreak = (datesArray) => {
    console.log('getStreak', datesArray);
    var today = moment();
    // var yesterday = new Date(today.setDate(today.getDate() - 1));
    var yesterday = moment().subtract(1, 'days');
    var longestStreak = 0;
    var currentStreak = 0;
    var streakNumber = 1;
    var streakGoing = true;
    for (var i=0; i < datesArray.length; i++) {
      // set first item to track and then keep checking next one
      if(i===0){
        var startingDay = moment(datesArray[i]);
        if(datesArray.length === 1){
          var daysDiffCurrent = today.diff(startingDay, 'days');
          var daysDiffYesterday = yesterday.diff(startingDay, 'days');
          if((daysDiffCurrent === 0 || daysDiffCurrent === 1) || (daysDiffYesterday === 0 || daysDiffYesterday === 1)){
            currentStreak = 1;
          };
        };
        continue;
      };
      // check starting point with datesArray[i];
      // if one day diff, keep streak going, add to streakNumber;
      var currentDay = moment(datesArray[i]);
      // var daysDiff = getDifferenceInDays(currentDay, startingDay);
      var daysDiff = currentDay.diff(startingDay, 'days');
      console.log(currentDay, startingDay, daysDiff);
      startingDay = currentDay;
      if(daysDiff === 1){
        streakNumber++;
        if(i === datesArray.length - 1){
          // check if today or yesterday is this last days
          var daysDiffCurrent = today.diff(currentDay, 'days');
          var daysDiffYesterday = yesterday.diff(currentDay, 'days');
          if((daysDiffCurrent === 0 || daysDiffCurrent === 1) || (daysDiffYesterday === 0 || daysDiffYesterday === 1)){
            currentStreak = streakNumber;
          } else{
            currentStreak = 0;
          };
        };
      } else {
        if(longestStreak < streakNumber){
          longestStreak = streakNumber;
        };
        streakNumber = 1;
        if(i === datesArray.length - 1){
          console.log('last day', '\ncurrentDay:', currentDay, '\ntoday:', today, '\nyesterday:', yesterday)
          var daysDiffCurrent = today.diff(currentDay, 'days');
          var daysDiffYesterday = yesterday.diff(currentDay, 'days');
          console.log('daysDiffCurrent', daysDiffCurrent, '\n  daysDiffYesterday', daysDiffYesterday);
          if((daysDiffCurrent === 0 || daysDiffCurrent === 1) || (daysDiffYesterday === 0 || daysDiffYesterday === 1)){
            currentStreak = streakNumber;
          } else{
            currentStreak = 0;
          };
        };
      };
    };
    return [longestStreak, currentStreak];
  };

  const [markedDays, contributionDays, longestStreak, currentStreak] = getData(data);
  const [dates, setDates] = useState(markedDays);
  const [contributionGraphDays, setContributionGraphDays] = useState(contributionDays);

  const getGraphEndDay = () => {
    const currentDay = new Date();
    const endDayAdd = currentDay.setDate(currentDay.getDate() + 31);
    const endDay = new Date(endDayAdd);
    return endDay;
  };

  const graphEndDay = getGraphEndDay();

  const chartConfig = {
    backgroundGradientFrom: "#5680e8",
    // backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#5680e8",
    // backgroundGradientToOpacity: 0.5,
    backgroundColor: '#fff',
    color: (opacity = 1) => `rgba(120, 255, 220, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  useEffect(()=>{
    console.log('Habit detail screen state', result);
  }, [result]);

  return(
    <>
      <View style={styles(themeContext.state.theme).container}>
        <ScrollView>
          <Text>HabitDetailScreen</Text>
          <Text>{result?result.name:''}</Text>
          <Text>{id}</Text>
          <Text>Longest Streak: {longestStreak}</Text>
          <Text>Current Streak: {currentStreak}</Text>
          <ContributionGraph
            values={contributionGraphDays}
            endDate={graphEndDay}
            numDays={105}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles(themeContext.state.theme).ContributionGraph}
          />
          <Calendar
            markedDates={dates}
            markingType={'period'}
          />
        </ScrollView>
      </View>
    </>
  )
}

// HabitDetailScreen.navigationOptions = () => {
//   return {
//     // headerShown: false
//   };
// };

const styles = (props) => StyleSheet.create({
  container:{
    // justifyContent: 'space-around',
    // alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  ContributionGraph:{
    marginRight: 20,
  },
})

export default HabitDetailScreen;
