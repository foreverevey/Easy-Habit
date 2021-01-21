import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage,FlatList,Platform,
StatusBar, ImageBackground} from 'react-native';
import HabitRow from '../components/HabitRow';
import { NavigationEvents} from 'react-navigation';
import {MyContext as HabitContext} from '../context/habitContext';
import Spinner from 'react-native-loading-spinner-overlay';
import MyHeader from '../components/Header';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {MyContext as ThemeContext} from '../context/themeContext';

const HomeScreen = ({navigation}) => {

  const getFormatedDay = (selectDate) => {
    const dd = String(selectDate.getDate()).padStart(2, '0');
    const mm = String(selectDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = selectDate.getFullYear();
    const formatedDate = mm + '/' + dd + '/' + yyyy;
    return formatedDate;
  };

  const defaultDay = getFormatedDay(new Date());
  const {state, getHabits, addHabit, deleteHabit, addDateHabit, removeDateHabit} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const showDatePicker = () => {
    // console.log('ShowDatePicker');
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideSettingsPicker = () => {
    setSettingsPickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.log("A date has been picked: ", date);
    const formatedDate = getFormatedDay(date);
    setSelectedDay(formatedDate);
    hideDatePicker();
  };

  const delHabit = async (id) => {
    console.log('delHabit', id);
    try{
      await deleteHabit(id);
      setSelectedHabit(null);
    } catch(error){
      console.log(error);
      return false;
    }
  };

  const newHabit = async () => {
    try{
      await addHabit();
    } catch (error){
      console.log(error);
      return false;
    }
  };

  const addDate = async (id) =>{
    try{
      setLoading(true);
      await addDateHabit(id, selectedDay).then(()=>{
        setLoading(false);
      });
    } catch(error){
      setLoading(false);
      console.log('Homescreen add date error', error);
    }
  };

  const removeDate = async (id) =>{
    try{
      setLoading(true);
      await removeDateHabit(id, selectedDay).then(()=>{
        setLoading(false);
      });
    } catch(error){
      setLoading(false);
      console.log('Homescreen remove date error', error);
    }
  };

  const selectNextDay = () => {
    const currentDay = new Date(selectedDay);
    const nextDayAdd = currentDay.setDate(currentDay.getDate() + 1);
    const nextDay = new Date(nextDayAdd);
    const formatedDate = getFormatedDay(nextDay);
    setSelectedDay(formatedDate);
  };

  const selectPreviousDay = () => {
    const currentDay = new Date(selectedDay);
    const previousDayAdd = currentDay.setDate(currentDay.getDate() - 1);
    const previousDay = new Date(previousDayAdd);
    const formatedDate = getFormatedDay(previousDay);
    setSelectedDay(formatedDate);
  };

  useEffect(() => {
      setLoading(true);
      navigation.setParams({ getDatePicker: showDatePicker });
      navigation.setParams({ selectNextDay: selectNextDay});
      navigation.setParams({ selectPreviousDay: selectPreviousDay});
      navigation.setParams({ selectedDay: selectedDay });
      navigation.setParams({ theme: themeContext.state });
      navigation.setParams({ newHabit: newHabit });
      navigation.setParams({ selectedHabit: selectedHabit });
      navigation.setParams({ deleteHabit: delHabit });
      getHabits().then(()=>{
        setLoading(false);
    });
  }, []);

  useEffect(() => {
    navigation.setParams({ theme: themeContext.state });
  }, [themeContext.state]);

  useEffect(() => {
    navigation.setParams({ selectedDay: selectedDay });
    navigation.setParams({ selectNextDay: selectNextDay});
    navigation.setParams({ selectPreviousDay: selectPreviousDay});
  }, [selectedDay]);

  const selectHabit = (id) => {
    console.log('selectHabit', id);
    if(id === selectedHabit){
      setSelectedHabit(null);
    } else{
      setSelectedHabit(id);
    }
  };

  useEffect(() => {
    navigation.setParams({ selectedHabit: selectedHabit });
  }, [selectedHabit]);

  return (
    <View style={styles(themeContext.state.theme).container}>
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={'Loading...'}
          textStyle={styles(themeContext.state.theme).spinnerTextStyle}
        />
      </View>
      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date(selectedDay)}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
            <FlatList style={styles(themeContext.state.theme).flatList}
              data={state}
              keyExtractor={item => item._id}
              extraData={selectedHabit}
              renderItem= {({item}) => {
                return (
                  <>
                    <HabitRow
                      Text={item.name}
                      Dates={item.dates}
                      ID={item._id}
                      SelectedDate={selectedDay}
                      Selected={selectedHabit === item._id?true:false}
                      onPress={()=>{navigation.navigate('Detail', {item: item._id, data: item, theme: themeContext.state.theme})}}
                      onLongPress={()=>{selectHabit(item._id)}}
                      addDate={()=>{addDate(item._id)}}
                      removeDate={()=>{removeDate(item._id)}}>
                    </HabitRow>
                  </>
                  );
                }}/>
      </ImageBackground>
    </View>
  )
}

HomeScreen.navigationOptions = ({navigation}) => {
  return MyHeader(navigation);
};

const styles = (props) => StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container:{
    justifyContent: 'space-around',
    // alignItems: "center",
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  ImageBackground:{
    // paddingTop: 130,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
    flex:1
  },
  flatList:{
    marginHorizontal: 10,
    marginTop:-10,
  },
  NewAcc:{
    alignSelf:'center',
    marginTop:30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 66,
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    // borderRadius: 20,
    padding: 35,
    height:300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})

export default HomeScreen;
