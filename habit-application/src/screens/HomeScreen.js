import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, StatusBar, ImageBackground} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {FontAwesome5} from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useNetInfo} from "@react-native-community/netinfo";
import NetInfo from '@react-native-community/netinfo';
import MyHeader from '../components/Header';
import HabitRow from '../components/HabitRow';
import ErrModal from '../components/ErrModal';
import {MyContext as HabitContext} from '../context/habitContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

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
  const languageContext = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [errModalMsg, setErrModalMsg] = useState('');
  const [reloadButton, setReloadButton] = useState(false);
  const netInfo = useNetInfo();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideSettingsPicker = () => {
    setSettingsPickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formatedDate = getFormatedDay(date);
    setSelectedDay(formatedDate);
    hideDatePicker();
  };

  //TODO add error messages when del habit or new habit goes wrong

  const delHabit = async (id) => {
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        try{
          setLoading(true);
          await deleteHabit(id).then(()=>{
            setLoading(false);
          });
          setSelectedHabit(null);
        } catch(error){
          setErrModalMsg(languageContext.state.language.errorReachingDB);
          setLoading(false);
          return false;
        }
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  };

  const newHabit = async () => {
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        try{
          await addHabit();
        } catch (error){
          setErrModalMsg(languageContext.state.language.errorReachingDB);
          return false;
        }
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  };

  const addDate = async (id) =>{
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        try{
          setLoading(true);
          await addDateHabit(id, selectedDay).then(()=>{
            setLoading(false);
          });
        } catch(error){
          setLoading(false);
          setErrModalMsg(languageContext.state.language.errorReachingDB);
        }
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  };

  const removeDate = async (id) =>{
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        try{
          setLoading(true);
          await removeDateHabit(id, selectedDay).then(()=>{
            setLoading(false);
          });
        } catch(error){
          setLoading(false);
          setErrModalMsg(languageContext.state.language.errorReachingDB);
        }
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
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

  const loadHabits = () =>{
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        setLoading(true);
        setErrModalMsg('');
        getHabits().then((res)=>{
          if(res){
            setLoading(false);
            setReloadButton(false);
            setErrModalMsg('');
          } else{
            setLoading(false);
            setErrModalMsg(languageContext.state.language.errorUnableToFetch);
            setReloadButton(true);
          }
        });
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  }

  useEffect(() => {
      setLoading(true);
      navigation.setParams({
        getDatePicker: showDatePicker,
        selectNextDay: selectNextDay,
        selectPreviousDay: selectPreviousDay,
        selectedDay: selectedDay,
        theme: themeContext.state,
        language: languageContext.state.language,
        newHabit: newHabit,
        selectedHabit: selectedHabit,
        deleteHabit: delHabit
      });
      NetInfo.fetch().then(async state => {
        if(state.isInternetReachable){
          getHabits().then((res)=>{
            if(res){
              setLoading(false);
              setReloadButton(false);
              setErrModalMsg('');
            } else{
              setLoading(false);
              setErrModalMsg(languageContext.state.language.errorUnableToFetch);
              setReloadButton(true);
            }
        });
        } else {
          setErrModalMsg(languageContext.state.language.errorNoInternet);
          setLoading(false);
          setErrModalMsg(languageContext.state.language.errorUnableToFetch);
          setReloadButton(true);
        }
      });

  }, []);

  useEffect(() => {
    if(!netInfo.isInternetReachable){
      setErrModalMsg(languageContext.state.language.errorNoInternet);
    } else {
      setErrModalMsg('');
    }
  }, [netInfo]);

  useEffect(() => {
    navigation.setParams({ theme: themeContext.state });
  }, [themeContext.state]);

  useEffect(() => {
    navigation.setParams({ language: languageContext.state.language });
  }, [languageContext.state]);

  useEffect(() => {
    navigation.setParams({
      selectedDay: selectedDay,
      selectNextDay: selectNextDay,
      selectPreviousDay: selectPreviousDay
     });
  }, [selectedDay]);

  const selectHabit = (id) => {
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
      <ErrModal isVisible={errModalMsg!==''?true:false} errMessage={errModalMsg} onPressOutside={()=>setErrModalMsg('')}/>
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme).spinnerTextStyle}
        />
      </View>
      <View>
        <DateTimePickerModal
          locale="lt"
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date(selectedDay)}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
            {reloadButton && <TouchableOpacity style={styles(themeContext.state.theme).ReloadButton} onPress={()=>loadHabits()}>
              <FontAwesome5 style={styles(themeContext.state.theme).Icon} name="sync-alt"/>
            </TouchableOpacity>}
            {state.length === 0 && !loading && <TouchableOpacity style={styles(themeContext.state.theme).FirstCreate}
              onPress={()=>navigation.navigate('Create', {theme: themeContext.state.theme, language: languageContext.state.language})}>
              <Text style={styles(themeContext.state.theme).FirstText}>
                Create your first habbit!
              </Text>
              <FontAwesome5 style={styles(themeContext.state.theme).Icon} name="plus"/>
            </TouchableOpacity>}
            <FlatList style={styles(themeContext.state.theme).flatList}
              data={state}
              keyExtractor={item => item._id}
              extraData={selectedHabit}
              renderItem= {({item}) => {
                const selDay = new Date(selectedDay);
                //item.trackedDays['mon'] == false then if selected day == mon and our settings
                // is not show then not show
                if(languageContext.state.showNotChosenDays === 'false'){
                  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  var dayName = dayList[selDay.getDay()];
                  if(item.trackedDays[dayName]){
                    return (
                      <>
                        <HabitRow
                          Text={item.name}
                          Dates={item.dates}
                          ID={item._id}
                          SelectedDate={selectedDay}
                          Selected={selectedHabit === item._id?true:false}
                          onPress={()=>{navigation.navigate('Detail', {item: item._id, data: item, theme: themeContext.state.theme, language: languageContext.state.language})}}
                          onLongPress={()=>{selectHabit(item._id)}}
                          addDate={()=>{addDate(item._id)}}
                          longPressSetting={languageContext.state.longClickHabit}
                          removeDate={()=>{removeDate(item._id)}}>
                        </HabitRow>
                      </>
                      );
                  }
                } else {
                  return (
                    <>
                      <HabitRow
                        Text={item.name}
                        Dates={item.dates}
                        ID={item._id}
                        SelectedDate={selectedDay}
                        Selected={selectedHabit === item._id?true:false}
                        onPress={()=>{navigation.navigate('Detail', {item: item._id, data: item, theme: themeContext.state.theme, language: languageContext.state.language})}}
                        onLongPress={()=>{selectHabit(item._id)}}
                        addDate={()=>{addDate(item._id)}}
                        longPressSetting={languageContext.state.longClickHabit}
                        removeDate={()=>{removeDate(item._id)}}>
                      </HabitRow>
                    </>
                    );
                }
                }}/>
      </ImageBackground>
    </View>
  )
}

HomeScreen.navigationOptions = ({navigation}) => {
  const { params } = navigation.state;
  const language = params.language;
  return MyHeader(navigation, language);
};

const styles = (props) => StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container:{
    justifyContent: 'space-around',
    flex: 1,
  },
  ImageBackground:{
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
    backgroundColor: "white",
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
  },
  ReloadButton:{
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
  },
  Icon:{
    fontSize: 34,
    color: props.headerPlus,
  },
  FirstCreate:{
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
  },
  FirstText:{
    fontSize: 22,
    margin:20,
    textAlign: "center",
    color: props.headerPlus,
  },
});

export default HomeScreen;
