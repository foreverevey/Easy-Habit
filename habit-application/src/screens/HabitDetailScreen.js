import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
import { MyContext as HabitContext } from '../context/habitContext';
import habitApi from '../api/habitApi';

const HabitDetailScreen = ({navigation}) => {
  const {state} = useContext(HabitContext);
  const id = navigation.getParam('item');

  const [result, setResult] = useState({});
  const [dates, setDates] = useState([]);

  const getResult = async(id) =>{
    const response = await habitApi.get('/habit', {
      params:{
        id: id
      }
    });
    console.log(response.data)
    setResult(response.data[0]);
    const formatDates = response.data[0].dates;
    formatDates.forEach(date=>{
      const formatDate = new Date(date.date);
      date.date = formatDate.getFullYear()+'-' + (formatDate.getMonth()+1) + '-'+formatDate.getDate();
    });
    console.log('formatDates', formatDates)
    setDates(formatDates);
  }

  // const newDate = new Date(date);
  // newDate.getFullYear()+'-' + (newDate.getMonth()+1) + '-'+newDate.getDate();

  useEffect(()=>{
    console.log('Habit detail screen state', result);
  }, [result]);

  useEffect(()=>{
    getResult(id);
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
