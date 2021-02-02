import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, AsyncStorage, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { MyContext as HabitContext } from '../context/habitContext';
import habitApi from '../api/habitApi';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {ContributionGraph, BarChart, LineChart} from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';
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
  const languageContext = useContext(LanguageContext);
  const id = navigation.getParam('item');
  const data = navigation.getParam('data');
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get('window').height;
  const [result, setResult] = useState(data);

  const getData = (data) =>{
    console.log('getData detail screen', data);
    const trackedHabitDays = data.trackedDays;
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
    var [longestStreak, currentStreak] = getStreak(datesArray, trackedHabitDays);
    var barData = getBarData(datesArray);
    console.log('streaks', longestStreak, currentStreak);
    return [markedDates, contributionDays, longestStreak, currentStreak, barData];
  };

  const getTrackedDaysDiff = (trackedHabitDays) => {
    /*
    This function takes user selected days and marks distances between them,
    to help calculate streaks. Example if selected days are Wed and Fri. If user
    completes week1 Wed and Fri and week2 Wed but no Fri, streak will be 3. Ignoring
    all the other dates whether they are marked (assume from previous settings) or not.
    */
    const objectDay = {
      "Mon": 0,
      "Tue": 0,
      "Wed": 0,
      "Thu": 0,
      "Fri": 0,
      "Sat": 0,
      "Sun": 0,
    };

    const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for(var i = 0; i < dayList.length; i++){
      if(trackedHabitDays[dayList[i]] === true){
        var counter = 0;
        for(var j = 0; j < dayList.length; j++){
          if(i!==j){
            if(trackedHabitDays[dayList[j]] === true){
              if(j < i && counter == 0){
                var diff = j - i;
                if(diff < 0){
                  diff += 7;
                }
                objectDay[dayList[i]] = diff
                counter++;
              }
              if(j>i){
                var diff = j - i;
                objectDay[dayList[i]] = diff
                break;
              }
            };
          };
        };
      };
    };
    return objectDay;
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

  const getStreak = (datesArray, trackedHabitDays) => {
    var today = moment();
    var yesterday = moment().subtract(1, 'days');
    var longestStreak = 0;
    var currentStreak = 0;
    var streakNumber = 1;
    var streakGoing = true;

    const daysTrackObj = getTrackedDaysDiff(trackedHabitDays);

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
      var checkIfSelected = trackedHabitDays[startingDay.format('dddd').slice(0,3)];
      if(checkIfSelected === false){
        startingDay = moment(datesArray[i]);
        continue;
      };
      var currentDay = moment(datesArray[i]);
      var checkIfSelectedCurrent = trackedHabitDays[currentDay.format('dddd').slice(0,3)];
      if(checkIfSelectedCurrent === false){
        continue;
      };
      var daysDiff = currentDay.diff(startingDay, 'days');
      // console.log('tttttt', daysTrackObj[startingDay.format('dddd').slice(0,3)], daysDiff, startingDay.format('dddd').slice(0,3), currentDay.format('dddd').slice(0,3));
      var startingDayFormat = startingDay.format('dddd').slice(0,3);
      startingDay = currentDay;
      if(daysDiff === daysTrackObj[startingDayFormat]){
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
                placeholder={languageContext.state.language.habitNamePlaceholder}
                paddingLeft={15}/>
              <TextInput style={styles(themeContext.state.theme).TextInputDescription}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                value={description}
                editable={edit?true:false}
                onChangeText={(newValue)=> setDescription(newValue)}
                placeholder={languageContext.state.language.habitDescriptionPlaceholder}
                paddingLeft={15}
                paddingTop={15}/>
              <View style={styles(themeContext.state.theme).Grouped}>
                <Text style={styles(themeContext.state.theme).Text}>{languageContext.state.language.privateText}</Text>
                <CheckBox
                  style={styles(themeContext.state.theme).CheckboxPrivate}
                  disabled={edit?false:true}
                  value={privateBool}
                  onValueChange={setPrivateBool}
                  tintColors={{true:themeContext.state.theme.checkPlus, false:themeContext.state.theme.habitRowBackground}}
                  />
              </View>
              <View style={styles(themeContext.state.theme).Schedule1}>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.mon}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.tue}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.wen}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.thu}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.fri}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.sat}</Text>
                <Text style={styles(themeContext.state.theme).Schedule1Item}>{languageContext.state.language.sun}</Text>
              </View>
              <View style={styles(themeContext.state.theme).Schedule2}>
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
              {edit && <ButtonLogin style={styles(themeContext.state.theme).ButtonSave} text={languageContext.state.language.save} onPress={()=>{
                  saveEditHabit();
                }
                }/>}
            </View>
            <StreakRow StreakText={languageContext.state.language.longestStreak + `${longestStreak}`}/>
            <StreakRow StreakText={languageContext.state.language.currentStreak + `${currentStreak}`}/>
            <View style={styles(themeContext.state.theme).GraphView}>
              <Text style={styles(themeContext.state.theme).GraphText}>{languageContext.state.language.contributionGraph}</Text>
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
              <Text style={styles(themeContext.state.theme).GraphText}>{languageContext.state.language.monthlyLineChart}</Text>
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
              <Text style={styles(themeContext.state.theme).GraphText}>{languageContext.state.language.calendarOverview}</Text>
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
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
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
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  Text:{
    color: props.headerPlus,
  },
  Schedule1:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  Schedule2:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
    marginLeft: 20,
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
