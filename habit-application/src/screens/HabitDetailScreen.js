import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, AsyncStorage, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { MyContext as HabitContext } from '../context/habitContext';
import habitApi from '../api/habitApi';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {ContributionGraph, BarChart, LineChart} from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import {MyContext as ThemeContext} from '../context/themeContext';
import moment from 'moment';
import StreakRow from '../components/StreakRow';
import {FontAwesome} from '@expo/vector-icons';
import ButtonLogin from '../components/ButtonLogin';
import MyHeaderSecondary from '../components/HeaderSecondary';
import CheckBox from '@react-native-community/checkbox';
import Spinner from 'react-native-loading-spinner-overlay';

const HabitDetailScreen = ({navigation}) => {
  const {state, editHabit} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const id = navigation.getParam('item');
  const data = navigation.getParam('data');
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get('window').height;
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
    var barData = getBarData(datesArray);
    console.log('streaks', longestStreak, currentStreak);
    return [markedDates, contributionDays, longestStreak, currentStreak, barData];
  };

  const getMarkedDates = (datesArray) =>{
    var markedDates = {};
    var startingDay = {startingDay: true, selected: true, marked: true, textColor: themeContext.state.theme.text, color: themeContext.state.theme.calendarText,};
    var endingDay = {endingDay: true, selected: true, marked: true, textColor: themeContext.state.theme.text, color: themeContext.state.theme.calendarText,};
    var middleDay = {selected: true, marked: true, textColor: themeContext.state.theme.text, color: themeContext.state.theme.calendarText,};
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

  const getStreak = (datesArray) => {
    var today = moment();
    var yesterday = moment().subtract(1, 'days');
    var longestStreak = 0;
    var currentStreak = 0;
    var streakNumber = 1;
    var streakGoing = true;
    for (var i=0; i < datesArray.length; i++) {
      if(i===0){
        var startingDay = moment(datesArray[i]);
        if(datesArray.length === 1){
          var daysDiffCurrent = today.diff(startingDay, 'days');
          var daysDiffYesterday = yesterday.diff(startingDay, 'days');
          if((daysDiffCurrent === 0 || daysDiffCurrent === 1) || (daysDiffYesterday === 0 || daysDiffYesterday === 1)){
            currentStreak = 1;
          };
          longestStreak = 1;
        };
        continue;
      };
      var currentDay = moment(datesArray[i]);
      var daysDiff = currentDay.diff(startingDay, 'days');
      startingDay = currentDay;
      if(daysDiff === 1){
        streakNumber++;
        if(i === datesArray.length - 1){
          var daysDiffCurrent = today.diff(currentDay, 'days');
          var daysDiffYesterday = yesterday.diff(currentDay, 'days');
          if((daysDiffCurrent === 0 || daysDiffCurrent === 1) || (daysDiffYesterday === 0 || daysDiffYesterday === 1)){
            currentStreak = streakNumber;
          } else{
            currentStreak = 0;
          };
        };
        if(longestStreak < streakNumber){
          longestStreak = streakNumber;
        };
      } else {
        if(longestStreak < streakNumber){
          longestStreak = streakNumber;
        };
        streakNumber = 1;
        if(i === datesArray.length - 1){
          var daysDiffCurrent = today.diff(currentDay, 'days');
          var daysDiffYesterday = yesterday.diff(currentDay, 'days');
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

  const getBarData = (datesArray) =>{
    const labelMonths = [];
    const data = [];
    var momentDates = datesArray.map(date => {
      return moment(date);
    });
    var today = moment();
    var firstMonth = today.format('MMM');
    labelMonths.unshift(firstMonth);
    var filteredList = momentDates.filter((date) => date.format('MMM') === firstMonth);
    data.unshift(filteredList.length);

    for(var i=0; i < 11; i++){
      var monthName = today.subtract(1, 'month').format('MMM');
      labelMonths.unshift(monthName);
      var filteredList = momentDates.filter((date) => date.format('MMM') === monthName);
      data.unshift(filteredList.length);
    };

    const dataSet = {
      labels: labelMonths,
      datasets:[
        {
          data: data,
        }
      ]
    };
    return dataSet;
  };

  const [markedDays, contributionDays, longestStreak, currentStreak, barData] = getData(data);
  const [dates, setDates] = useState(markedDays);
  const [contributionGraphDays, setContributionGraphDays] = useState(contributionDays);
  const [privateBool, setPrivateBool] = useState(result.private_bool);
  const [name, setName] = useState(result.name);
  const [description, setDescription] = useState(result.description);
  const [trackedDays, setTrackedDays] = useState(result.trackedDays);
  const [edit, setEdit] = useState(false);
  const [repeat, setRepeat] = useState('daily');
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(false);

  const getGraphEndDay = () => {
    const currentDay = new Date();
    const endDayAdd = currentDay.setDate(currentDay.getDate() + 31);
    const endDay = new Date(endDayAdd);
    return endDay;
  };

  const graphEndDay = getGraphEndDay();

  // const rgba = themeContext.state.theme.chartRgba;
  // console.log('rgba', rgba, themeContext.state.theme);

  const chartConfig = {
    backgroundGradientFrom: themeContext.state.theme.chartBackground,
    // backgroundGradientFromOpacity: 0,
    backgroundGradientTo: themeContext.state.theme.chartBackground,
    // backgroundGradientToOpacity: 0.5,
    backgroundColor: '#fff',
    color: (opacity = 1) => `rgba(${themeContext.state.theme.chartRgba}, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const barChartConfig = {
    backgroundGradientFrom: themeContext.state.theme.chartBackground,
    // backgroundGradientFromOpacity: 0,
    backgroundGradientTo: themeContext.state.theme.chartBackground,
    // backgroundGradientToOpacity: 0.5,
    backgroundColor: '#fff',
    color: (opacity = 1) => `rgba(${themeContext.state.theme.chartRgba}, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.3,
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 0,
    segments: 10,
  };

  useEffect(()=>{
    console.log('Habit detail screen state', result);
  }, [result]);

  useEffect(()=>{
    navigation.setParams({ editHabit: editHab });
    navigation.setParams({ edit: edit });
  }, []);

  useEffect(()=>{
    navigation.setParams({ editHabit: editHab });
    navigation.setParams({ edit: edit });
  }, [edit]);

  const editHab = () => {
    console.log('edit habi', edit);
    setEdit(!edit);
  };

  const saveEditHabit = async () => {
    console.log(id, '\n', name,'\n', description,'\n', privateBool,'\n', trackedDays);
    setLoading(true);
    await editHabit(id, name, privateBool, description, trackedDays);
    setLoading(false);
    setEdit(false);
  };

  // useEffect(() => {
  //     navigation.setParams({ theme: themeContext.state });
  // }, []);

  const changeTrackedDays = (day) => {
    console.log(day, trackedDays.Mon, trackedDays[day]);
    const newTracked = trackedDays;
    newTracked[day] = !trackedDays[day];
    console.log(newTracked);
    setTrackedDays(newTracked);
    setReload(!reload);
  };

  return(
      <View style={styles(themeContext.state.theme).container}>
        <View>
          <Spinner
            visible={loading?true:false}
            textContent={'Loading...'}
            textStyle={styles(themeContext.state.theme).spinnerTextStyle}
          />
        </View>
        <ScrollView>
          <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
            <View style={styles(themeContext.state.theme).HabitDetails}>
              <TextInput style={styles(themeContext.state.theme).TextInputName}
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(newValue)=> setName(newValue)}
                editable={edit?true:false}
                placeholder="Name"
                paddingLeft={15}/>
              <TextInput style={styles(themeContext.state.theme).TextInputDescription}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                value={description}
                editable={edit?true:false}
                onChangeText={(newValue)=> setDescription(newValue)}
                placeholder="Description"
                paddingLeft={15}
                paddingTop={15}/>
              <View style={styles(themeContext.state.theme).Grouped}>
                <Text style={styles(themeContext.state.theme).Text}>Private</Text>
                <CheckBox
                  style={styles(themeContext.state.theme).CheckboxPrivate}
                  disabled={edit?false:true}
                  value={privateBool}
                  onValueChange={setPrivateBool}
                  tintColors={{true:themeContext.state.theme.checkPlus, false:themeContext.state.theme.habitRowBackground}}
                  />
              </View>
              <View style={styles(themeContext.state.theme).Schedule1}>
                <Text style={styles(themeContext.state.theme).Schedule1Label}>Day(s)</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Mon</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Tue</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Wen</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Thu</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Fri</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Sat</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>Sun</Text>
              </View>
              <View style={styles(themeContext.state.theme).Schedule2}>
                <Text style={styles(themeContext.state.theme).Schedule1Label}></Text>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Mon')}>
                    {trackedDays.Mon &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Mon &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Tue')}>
                    {trackedDays.Tue &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Tue &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Wed')}>
                    {trackedDays.Wed &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Wed &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Thu')}>
                    {trackedDays.Thu &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Thu &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Fri')}>
                    {trackedDays.Fri &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Fri &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Sat')}>
                    {trackedDays.Sat &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Sat &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
                <View style={styles(themeContext.state.theme).CheckboxView}>
                  <TouchableOpacity disabled={edit?false:true} onPress={()=>changeTrackedDays('Sun')}>
                    {trackedDays.Sun &&
                      <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                    {!trackedDays.Sun &&
                      <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
                  </TouchableOpacity>
                </View>
              </View>
              {edit && <ButtonLogin style={styles(themeContext.state.theme).ButtonSave} text='Save' onPress={()=>{
                  saveEditHabit();
                }
                }/>}
            </View>
            <StreakRow StreakText={`Longest Streak: ${longestStreak}`}/>
            <StreakRow StreakText={`Current Streak ${currentStreak}`}/>
            <View style={styles(themeContext.state.theme).GraphView}>
              <Text style={styles(themeContext.state.theme).GraphText}>Contribution Graph</Text>
              <ContributionGraph
                values={contributionGraphDays}
                endDate={graphEndDay}
                numDays={105}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles(themeContext.state.theme).ContributionGraph}
                showWeekdayLabels={true}
              />
            </View>

            {false && <BarChart
              style={styles(themeContext.state.theme).BarGraph}
              data={barData}
              width={screenWidth}
              height={250}
              yAxisLabel=""
              chartConfig={barChartConfig}
              verticalLabelRotation={30}
              fromZero={true}
            />}
            <View style={styles(themeContext.state.theme).GraphView}>
              <Text style={styles(themeContext.state.theme).GraphText}>Monthly Line Chart</Text>
              <LineChart
                style={styles(themeContext.state.theme).LineChart}
                data={barData}
                width={screenWidth}
                height={220}
                chartConfig={barChartConfig}
                decimalPlaces={0}
              />
            </View>
            <View style={styles(themeContext.state.theme).GraphView}>
              <Text style={styles(themeContext.state.theme).GraphText}>Calendar Overview</Text>
              <Calendar
                style={styles(themeContext.state.theme).Calendar}
                markedDates={dates}
                markingType={'period'}
                theme={{
                  calendarBackground: themeContext.state.theme.calendarBackground,
                  textSectionTitleColor: themeContext.state.theme.calendarText,
                  arrowColor: themeContext.state.theme.calendarText,
                  monthTextColor: themeContext.state.theme.calendarText,
                  dayTextColor:themeContext.state.theme.calendarText,
                }}
              />
            </View>

          </ImageBackground>
        </ScrollView>
      </View>
  )
}

// calendarBackground: '#ffffff',
// textSectionTitleColor: '#b6c1cd',
// textSectionTitleDisabledColor: '#d9e1e8',
// selectedDayBackgroundColor: '#00adf5',
// selectedDayTextColor: '#ffffff',
// todayTextColor: '#00adf5',
// dayTextColor: '#2d4150',
// textDisabledColor: '#d9e1e8',
// dotColor: '#00adf5',
// selectedDotColor: '#ffffff',
// arrowColor: 'orange',
// disabledArrowColor: '#d9e1e8',
// monthTextColor: 'blue',
// indicatorColor: 'blue',
// textDayFontFamily: 'monospace',
// textMonthFontFamily: 'monospace',
// textDayHeaderFontFamily: 'monospace',
// textDayFontWeight: '300',
// textMonthFontWeight: 'bold',
// textDayHeaderFontWeight: '300',
// textDayFontSize: 16,
// textMonthFontSize: 16,
// textDayHeaderFontSize: 16

HabitDetailScreen.navigationOptions = ({navigation}) => {
  const text = 'Habit details';
  const { params } = navigation.state;
  const theme = params.theme;
  return MyHeaderSecondary(navigation, text, theme);
};

const styles = (props) => StyleSheet.create({
  container:{
    flex:1,
  },
  ButtonSave:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContributionGraph:{
    marginTop: 5,
  },
  ImageBackground:{
    flex:1,
    justifyContent: 'space-around',
  },
  LineChart:{
    marginTop: 10,
  },
  Calendar:{
    marginTop: 10,
  },
  Header:{
    fontSize: 26,
    alignSelf: 'center',
    color: props.headerPlus,
  },
  TextInputName:{
    marginTop: 10,
    backgroundColor:'#fff',
    borderRadius: 15,
    height:50,
    backgroundColor: props.habitRowBackground,
    color: props.buttonText,
  },
  TextInputDescription:{
    marginTop:10,
    backgroundColor:'#fff',
    borderRadius: 15,
    height:120,
    textAlignVertical: 'top',
    backgroundColor: props.habitRowBackground,
    color: props.buttonText,
  },
  Grouped:{
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 10,
  },
  Text:{
    color: props.headerPlus,
  },
  Schedule1:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  Schedule2:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
    marginLeft: 10,
  },
  Schedule1Item:{
    flex: 1,
    color: props.headerPlus,
  },
  Schedule1Label:{
    flex: 1,
    color: props.headerPlus,
  },
  CheckboxView:{
    flex: 1,
  },
  CheckboxPlus:{
    fontSize:26,
    color: props.checkPlus,
  },
  Checkbox:{
    fontSize:26,
    color: props.checkPlus,
  },
  HabitDetails:{
    margin: 10,
    marginBottom: 20,
  },
  CheckboxPrivate:{
    color: props.headerPlus,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  GraphView:{
    marginTop:15,
    borderBottomWidth: 5,
    borderTopWidth: 0,
    borderColor: props.habitRowBackground,
  },
  GraphText:{
    color: props.headerPlus,
    fontSize: 16,
    alignSelf: 'center',
  }
})

export default HabitDetailScreen;
