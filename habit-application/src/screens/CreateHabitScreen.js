import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import {useNetInfo} from "@react-native-community/netinfo";
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import Spacer from '../components/Spacer';
import ButtonLogin from '../components/ButtonLogin';
import MyHeaderSecondary from '../components/HeaderSecondary';
import TrackedDaysList from '../components/TrackedDaysList';
import ErrModal from '../components/ErrModal';
import {MyContext} from '../context/authContext';
import {MyContext as HabitContext} from '../context/habitContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

const CreateHabitScreen = ({navigation}) =>{
  const {state} = useContext(MyContext);
  const {addHabit} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privateBool, setPrivateBool] = useState(false);
  const [trackedDays, setTrackedDays] = useState({
    'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true,
    'Sat': true, 'Sun': true});
  const [errModalMsg, setErrModalMsg] = useState('');
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!netInfo.isInternetReachable){
      setErrModalMsg(languageContext.state.language.errorNoInternet);
    } else {
      setErrModalMsg('');
    }
  }, [netInfo]);

  const createHabit = async (name, description, privateBool, trackedDays) => {
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        setLoading(true);
        await addHabit(name, privateBool, description, trackedDays).then(()=>{
          setLoading(false);
          navigation.navigate('Home', {language: languageContext.state.language});
        });
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
        setLoading(false);
      }
    });
  };

  const changeTrackedDays = (day) => {
    let newTracked = Object.assign({}, trackedDays);
    newTracked[day] = !trackedDays[day];
    setTrackedDays(newTracked);
  };

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <ErrModal isVisible={errModalMsg!==''?true:false} errMessage={errModalMsg} onPressOutside={()=>setErrModalMsg('')}/>
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme).spinnerTextStyle}
        />
      </View>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
        <Spacer>
          <TextInput style={styles(themeContext.state.theme).TextInputName}
            autoCapitalize="sentences"
            autoCorrect={false}
            value={name}
            onChangeText={(newValue)=> setName(newValue)}
            placeholder={languageContext.state.language.habitNamePlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderTextInBox}
            paddingLeft={15}/>
        </Spacer>
        <Spacer>
          <TextInput style={styles(themeContext.state.theme).TextInputDescription}
            multiline
            autoCapitalize="sentences"
            autoCorrect={false}
            value={description}
            onChangeText={(newValue)=> setDescription(newValue)}
            placeholder={languageContext.state.language.habitDescriptionPlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderTextInBox}
            paddingLeft={15}
            paddingTop={15}/>
        </Spacer>
        <Spacer>
          {false && <View style={styles(themeContext.state.theme).Grouped}>
            <Text style={styles(themeContext.state.theme).Text}>{languageContext.state.language.privateText}</Text>
            <CheckBox value={privateBool} onValueChange={()=>{setPrivateBool(!privateBool)}}/>
          </View>}
        </Spacer>
        <TrackedDaysList changeTrackedDays={changeTrackedDays} disabled={false} trackedDays={trackedDays}/>
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
  },
  TextInputName:{
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
  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default CreateHabitScreen;
