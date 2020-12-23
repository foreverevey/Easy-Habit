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
  const [dates, setDates] = useState([]);

  // const getResult = async(id) =>{
  //   const response = await habitApi.get('/habit', {
  //     params:{
  //       id: id
  //     }
  //   });
  //   console.log(response.data)
  //   setResult(response.data[0]);
  //   const formatDates = response.data[0].dates;
  //   formatDates.forEach(date=>{
  //     const formatDate = new Date(date.date);
  //     date.date = formatDate.getFullYear()+'-' + (formatDate.getMonth()+1) + '-'+formatDate.getDate();
  //   });
  //   console.log('formatDates', formatDates)
  //   setDates(formatDates);
  // }
  const getData = (test) =>{
    console.log('getData');
    setResult(test);
    console.log('setResult', test);
    const formatDates = test.dates;
    console.log(test, test.dates);
    formatDates.forEach(date=>{
      const formatDate = new Date(date.date);
      date.date = formatDate.getFullYear()+'-' + (formatDate.getMonth()+1) + '-'+formatDate.getDate();
    });
    setDates(formatDates);
  };

  // const newDate = new Date(date);
  // newDate.getFullYear()+'-' + (newDate.getMonth()+1) + '-'+newDate.getDate();

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
        <View>
          {dates.map(date => (
            <Text key={date._id}>{date.date}</Text>
          ))}
        </View>
      <Text>{id}</Text>
        <Calendar
        markedDates={{
          '2020-12-20': {textColor: 'green'},
          '2020-12-22': {startingDay: true, color: 'green'},
          '2020-12-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
          '2020-12-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
        }}
        markingType={'period'}
      />
    </View>
  )
}

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
