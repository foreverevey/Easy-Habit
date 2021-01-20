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

const CreateHabitScreen = ({navigation}) =>{
  const {state} = useContext(MyContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privateBool, setPrivateBool] = useState(false);
  const [trackedDays, setTrackedDays] = useState({
    'Mon': false, 'Tue': false, 'Wed': false, 'Thu': false, 'Fri': false,
    'Sat': false, 'Sun': false})
  const {addHabit} = useContext(HabitContext);
  const themeContext = useContext(ThemeContext);

  const createHabit = async (name,description,privateBool,trackedDays) => {
    await addHabit(name, privateBool, description, trackedDays);
    navigation.navigate('Home');
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
            <CheckBox value={privateBool} onValueChange={()=>{setPrivateBool(!privateBool)}}/>
            <Text style={styles(themeContext.state.theme).Text}>Private</Text>
          </View>
        </Spacer>
        <ButtonLogin text='Create' onPress={()=>createHabit(name,description, privateBool, trackedDays)}/>
      </ImageBackground>
    </View>
  )
};

CreateHabitScreen.navigationOptions = () => {
  return {
    headerShown: true
  };
};

const styles = (props) => StyleSheet.create({
  MainParent:{
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50: 0,
  },
  TextInputName:{
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 20: 0,
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
    color:'white',
  },
  ImageBackground:{
    paddingTop: 0,
    width: '100%',
    height: '100%',
  },
});

export default CreateHabitScreen;
