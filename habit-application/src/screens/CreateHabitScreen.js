import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  StatusBar,
  CheckBox,
  ImageBackground,
} from 'react-native';
import {MyContext} from '../context/authContext';
import Spacer from '../components/Spacer';
import ButtonLogin from '../components/ButtonLogin';
import {MyContext as HabitContext} from '../context/habitContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {FontAwesome} from '@expo/vector-icons';
import MyHeaderSecondary from '../components/HeaderSecondary';

const CreateHabitScreen = ({navigation}) =>{
  const {state} = useContext(MyContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privateBool, setPrivateBool] = useState(false);
  const [trackedDays, setTrackedDays] = useState({
    'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true,
    'Sat': true, 'Sun': true})
  const {addHabit} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const [reload, setReload] = useState(true);

  const createHabit = async (name,description,privateBool,trackedDays) => {
    console.log(name,'\n', description,'\n', privateBool,'\n', trackedDays);
    await addHabit(name, privateBool, description, trackedDays);
    navigation.navigate('Home');
  };

  const changeTrackedDays = (day) => {
    console.log(day, trackedDays.Mon, trackedDays[day]);
    const newTracked = trackedDays;
    newTracked[day] = !trackedDays[day];
    console.log(newTracked);
    setTrackedDays(newTracked);
    setReload(!reload);
  };

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
        <Spacer>
          <TextInput style={styles(themeContext.state.theme).TextInputName}
            autoCapitalize="none"
            autoCorrect={false}
            value={name}
            onChangeText={(newValue)=> setName(newValue)}
            placeholder="Name"
            paddingLeft={15}/>
        </Spacer>
        <Spacer>
          <TextInput style={styles(themeContext.state.theme).TextInputDescription}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            value={description}
            onChangeText={(newValue)=> setDescription(newValue)}
            placeholder="Description"
            paddingLeft={15}
            paddingTop={15}/>
        </Spacer>
        <Spacer>
          <View style={styles(themeContext.state.theme).Grouped}>
            <Text style={styles(themeContext.state.theme).Text}>Private</Text>
            <CheckBox value={privateBool} onValueChange={()=>{setPrivateBool(!privateBool)}}/>
          </View>
        </Spacer>
        <View style={styles(themeContext.state.theme).trackDays}>
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
              <TouchableOpacity onPress={()=>changeTrackedDays('Mon')}>
                {trackedDays.Mon &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Mon &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Tue')}>
                {trackedDays.Tue &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Tue &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Wed')}>
                {trackedDays.Wed &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Wed &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Thu')}>
                {trackedDays.Thu &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Thu &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Fri')}>
                {trackedDays.Fri &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Fri &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Sat')}>
                {trackedDays.Sat &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Sat &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
            <View style={styles(themeContext.state.theme).CheckboxView}>
              <TouchableOpacity onPress={()=>changeTrackedDays('Sun')}>
                {trackedDays.Sun &&
                  <FontAwesome style={styles(themeContext.state.theme).CheckboxPlus} name="check"/>}
                {!trackedDays.Sun &&
                  <FontAwesome style={styles(themeContext.state.theme).Checkbox} name='close'/>}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ButtonLogin text='Create' onPress={()=>createHabit(name,description, privateBool, trackedDays)}/>
      </ImageBackground>
    </View>
  )
};

CreateHabitScreen.navigationOptions = ({navigation}) => {
  const text = 'Create Habit';
  const { params } = navigation.state;
  const theme = params.theme;
  return MyHeaderSecondary(navigation, text, theme);
};

const styles = (props) => StyleSheet.create({
  MainParent:{
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50: 0,
  },
  TextInputName:{
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 20: 0,
    backgroundColor:'#fff',
    borderRadius: 15,
    height:50,
  },
  TextInputDescription:{
    backgroundColor:'#fff',
    borderRadius: 15,
    height:120,
    textAlignVertical: 'top',
  },
  Grouped:{
    flexDirection: 'row',
    alignItems:'center',
  },
  Text:{
    color: props.headerPlus,
  },
  ImageBackground:{
    flex: 1,
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
    marginBottom: 10,
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
  trackDays:{
    height: 70,
  }
});

export default CreateHabitScreen;
