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
  const {state, getHabits, deleteHabit, addDateHabit, removeDateHabit, reloadState} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [index, setIndex] = useState(0);

  const showDatePicker = () => {
    console.log('ShowDatePicker');
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    const formatedDate = getFormatedDay(date);
    setSelectedDay(formatedDate);
    hideDatePicker();
  };

  const updateCount = () => {
    setCount(count + 1);
  };

  const updateDate = () => {
    console.log('updateDate');
    setDatePickerVisibility(true);
  };

  const delHabit = async (id) => {
    try{
      await deleteHabit(id);
    } catch(error){
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

  useEffect(() => {
      setLoading(true);
      // TODO: check params if we already have selectedDay?
      navigation.setParams({ increaseCount: updateCount });
      navigation.setParams({ getDatePicker: showDatePicker });
      navigation.setParams({ selectedDay: selectedDay });
      _getTheme().then(()=>{
        navigation.setParams({ theme: themeContext.state });
      });
      // navigation.setParams({ theme: themeContext.state });
      getHabits().then(()=>{
        setLoading(false);
    });
  }, []);

  const _changeThemeCheerful = () =>{
    themeContext.changeTheme('cheerful');
  };

  const _changeThemeClean = () =>{
    themeContext.changeTheme('clean');
  };

  useEffect(() => {
    navigation.setParams({ theme: themeContext.state });
  }, [themeContext.state]);

  const consoleTheme = () =>{
    console.log(themeContext.state);
    const theme = navigation.getParam('theme');
    console.log(theme);
  };

  _getTheme = async () => {
    const userTheme = await AsyncStorage.getItem('theme');
    if(userTheme === null){
      console.log('user theme is null', themeContext.state);
    } else {
      console.log('user theme is not null');
    }
  };

  useEffect(() => {
    navigation.setParams({ increaseCount: updateCount });
  }, [count]);

  // useEffect(() => {
  //   setIndex(index + 1);
  //   console.log('useEffect change index', index);
  // }, [state]);

  useEffect(() => {
    console.log('useEffect selectDay', selectedDay);
    navigation.setParams({ selectedDay: selectedDay });
    setIndex(index + 1);
    // setLoading(true);
    // setLoading(false);
  }, [selectedDay]);

  const clearStorage = async () => {
    try{
      await AsyncStorage.removeItem('token');
      const item = await AsyncStorage.getItem('token');
      return true;
    } catch(error){
      console.log(error);
      return false;
    }
  };

  const focusFunction = () => {
    console.log('focus function', state);
  }

  // if(loading){
  //   return(
  //     <Spinner
  //       visible={true}
  //       textContent={'Loading...'}
  //       textStyle={styles(themeContext.state.theme).spinnerTextStyle}
  //     />
  //   )
  // }

  if(true){
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
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
          <NavigationEvents onWillFocus={focusFunction}/>
              <FlatList style={styles(themeContext.state.theme).flatList}
                data={state}
                extraData={index}
                keyExtractor={item => item._id}
                renderItem= {({item}) => {
                  return (
                    <>
                      <HabitRow
                        Text={item.name}
                        Dates={item.dates}
                        SelectedDate={selectedDay}
                        onPress={()=>{navigation.navigate('Detail', {item: item._id, test: item})}}
                        addDate={()=>{addDate(item._id)}}
                        removeDate={()=>{removeDate(item._id)}}>
                      </HabitRow>
                      <TouchableOpacity onPress={()=>delHabit(item._id)}>
                        <Text>Delete Habit</Text>
                      </TouchableOpacity>

                    </>
                    );
                  }}/>
                  <TouchableOpacity
                    style={styles(themeContext.state.theme).NewAcc}
                    onPress={ async () => {
                      await clearStorage();
                      navigation.navigate('Signin');
                    }
                    }>
                  <Text style={styles(themeContext.state.theme).ForgotText}>Logout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles(themeContext.state.theme).NewAcc}
                    onPress={() =>_changeThemeCheerful()}>
                  <Text style={styles(themeContext.state.theme).ForgotText}>Change Theme Cheerful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles(themeContext.state.theme).NewAcc}
                    onPress={() =>_changeThemeClean()}>
                  <Text style={styles(themeContext.state.theme).ForgotText}>Change Theme Clean</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles(themeContext.state.theme).NewAcc}
                    onPress={() =>consoleTheme()}>
                  <Text style={styles(themeContext.state.theme).ForgotText}>Console Theme</Text>
                  </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }

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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  ImageBackground:{
    paddingTop: 150,

  },
  flatList:{
    marginHorizontal: 10,
    marginTop:-10,
  },
  NewAcc:{
    alignSelf:'center',
    marginTop:30,
  },
})

export default HomeScreen;
