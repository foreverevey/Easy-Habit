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
  ImageBackground,
} from 'react-native';
import {MyContext} from '../context/authContext';
import Spacer from '../components/Spacer';
import ButtonLogin from '../components/ButtonLogin';
import {MyContext as HabitContext} from '../context/habitContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';
import {FontAwesome} from '@expo/vector-icons';
import MyHeaderSecondary from '../components/HeaderSecondary';
import CheckBox from '@react-native-community/checkbox';

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
  const languageContext = useContext(LanguageContext);
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
            placeholder={languageContext.state.language.habitNamePlaceholder}
            paddingLeft={15}/>
        </Spacer>
        <Spacer>
          <TextInput style={styles(themeContext.state.theme).TextInputDescription}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            value={description}
            onChangeText={(newValue)=> setDescription(newValue)}
            placeholder={languageContext.state.language.habitDescriptionPlaceholder}
            paddingLeft={15}
            paddingTop={15}/>
        </Spacer>
        <Spacer>
          <View style={styles(themeContext.state.theme).Grouped}>
            <Text style={styles(themeContext.state.theme).Text}>{languageContext.state.language.privateText}</Text>
            <CheckBox value={privateBool} onValueChange={()=>{setPrivateBool(!privateBool)}}/>
          </View>
        </Spacer>
        <View style={styles(themeContext.state.theme).trackDays}>
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

        <ButtonLogin style={styles(themeContext.state.theme).ButtonSave} text={languageContext.state.language.create} onPress={()=>createHabit(name,description, privateBool, trackedDays)}/>
      </ImageBackground>
    </View>
  )
};

CreateHabitScreen.navigationOptions = ({navigation}) => {
  const text = 'Create Habit';
  const { params } = navigation.state;
  const theme = params.theme;
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
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
    backgroundColor: props.habitRowBackground,
    color: props.buttonText,
  },
  TextInputDescription:{
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
  ImageBackground:{
    flex: 1,
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
    marginBottom: 10,
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
  trackDays:{
    height: 70,
  },
  ButtonSave:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateHabitScreen;
