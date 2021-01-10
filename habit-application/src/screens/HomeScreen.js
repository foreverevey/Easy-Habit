import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage,FlatList,Platform,
StatusBar, ImageBackground, Modal, TouchableHighlight} from 'react-native';
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
  const [isSettingsPickerVisible, setSettingsPickerVisibility] = useState(false);

  const showDatePicker = () => {
    // console.log('ShowDatePicker');
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showSettingsPicker = () => {
    console.log('settings button');
    setSettingsPickerVisibility(!isSettingsPickerVisible);
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

  const updateDate = () => {
    // console.log('updateDate');
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

  useEffect(() => {
      console.log('first use effect on homescreen');
      setLoading(true);
      navigation.setParams({ getDatePicker: showDatePicker });
      navigation.setParams({ getSettingsPicker: showSettingsPicker });
      navigation.setParams({ selectedDay: selectedDay });
      navigation.setParams({ theme: themeContext.state });
      navigation.setParams({ newHabit: newHabit});
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

  useEffect(() => {
    navigation.setParams({ selectedDay: selectedDay });
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
      <View style={styles(themeContext.state.theme).centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={isSettingsPickerVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
              }}
            >
          <View style={styles(themeContext.state.theme).centeredView}>
            <View style={styles(themeContext.state.theme).modalView}>
              <Text style={styles(themeContext.state.theme).modalText}>Hello World!</Text>

              <TouchableHighlight
                style={{ ...styles(themeContext.state.theme).openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                    hideSettingsPicker();
                  }}
                >
                <Text style={styles(themeContext.state.theme).textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
            <FlatList style={styles(themeContext.state.theme).flatList}
              data={state}
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  ImageBackground:{
    paddingTop: 130,

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
