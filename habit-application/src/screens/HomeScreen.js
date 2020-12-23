import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage,FlatList,Platform,
StatusBar} from 'react-native';
import HabitRow from '../components/HabitRow';
import { NavigationEvents} from 'react-navigation';
import {MyContext as HabitContext} from '../context/habitContext';
import Spinner from 'react-native-loading-spinner-overlay';

const HomeScreen = ({navigation}) => {
  const {state, getHabits, deleteHabit, addDateHabit, removeDateHabit} = useContext(HabitContext);
  const [loading, setLoading] = useState(true);

  const delHabit = async (id) => {
    try{
      await deleteHabit(id);
    } catch(error){
      console.log(error);
      return false;
    }
  };

  const addDate = async (id) =>{
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    formatedDate = mm + '/' + dd + '/' + yyyy;
    console.log('today: ', formatedDate);
    try{
      setLoading(true);
      await addDateHabit(id, formatedDate).then(()=>{
        setLoading(false);
      });
    } catch(error){
      setLoading(false);
      console.log('Homescreen add date error', error);
    }
  };

  // Without date selection to test REST api
  const removeDate = async (id) =>{
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    formatedDate = mm + '/' + dd + '/' + yyyy;
    console.log('today: ', formatedDate);
    try{
      setLoading(true);
      await removeDateHabit(id, formatedDate).then(()=>{
        setLoading(false);
      });
    } catch(error){
      setLoading(false);
      console.log('Homescreen remove date error', error);
    }
  };

  useEffect(() => {
      setLoading(true);
      getHabits().then(()=>{
        setLoading(false);
      });
  }, []);

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
    // getHabits();
    // console.log('Printing habitState from focusFunction');
    console.log('focus function', state);
  }

  if(loading){
    return(
      <Spinner
        visible={true}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  if(!loading){
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={focusFunction}/>
            <FlatList style={styles.flatList}
              data={state}
              keyExtractor={item => item._id}
              renderItem= {({item}) => {
                return (
                  <>
                    <HabitRow Text={item.name} onPress={()=>{navigation.navigate('Detail', {item: item._id, test: item})}}>
                    </HabitRow>
                    <TouchableOpacity onPress={()=>delHabit(item._id)}>
                      <Text>Delete Habit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>addDate(item._id)}>
                      <Text>Add date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>removeDate(item._id)}>
                      <Text>Remove date</Text>
                    </TouchableOpacity>
                  </>
                  );
                }}/>
          <TouchableOpacity
            style={styles.NewAcc}
            onPress={() => {
              navigation.navigate('Create')
            }
            }>
            <Text style={styles.ForgotText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.NewAcc}
            onPress={() => {
              console.log("state", state);
            }
            }>
            <Text style={styles.ForgotText}>ConsoleLog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.NewAcc}
            onPress={ async () => {
              await clearStorage();
              navigation.navigate('Signin');
            }
            }>
          <Text style={styles.ForgotText}>Logout</Text>
          </TouchableOpacity>
      </View>
    )
  }

}

HomeScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container:{
    justifyContent: 'space-around',
    // alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
  },
  flatList:{
    marginHorizontal: 10,
    marginTop:25,
  },
  NewAcc:{
    alignSelf:'center',
    marginTop:30,
  },
})

export default HomeScreen;
