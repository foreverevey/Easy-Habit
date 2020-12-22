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
} from 'react-native';
import {MyContext} from '../context/authContext';
import Spacer from '../components/Spacer';
import ButtonLogin from '../components/ButtonLogin';
import {MyContext as HabitContext} from '../context/habitContext';


const CreateHabitScreen = ({navigation}) =>{
  const {state} = useContext(MyContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privateBool, setPrivateBool] = useState(false);
  const {habitState, addHabit} = useContext(HabitContext);
  // state for bool?

  const createHabit = async (name,description,privateBool) => {
    await addHabit(name, privateBool, description);
    // console.log(habitState);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.MainParent}>
      <Spacer>
        <TextInput style={styles.TextInputName}
          autoCapitalize="none"
          autoCorrect={false}
          value={name}
          onChangeText={(newValue)=> setName(newValue)}
          placeholder="Name"/>
      </Spacer>
      <Spacer>
        <TextInput style={styles.TextInputDescription}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          value={description}
          onChangeText={(newValue)=> setDescription(newValue)}
          placeholder="Description"/>
      </Spacer>
      <Spacer>
        <View style={styles.Grouped}>
          <CheckBox value={privateBool} onValueChange={()=>{setPrivateBool(!privateBool)}}/>
          <Text style={styles.Text}>Private</Text>
        </View>
      </Spacer>
      <ButtonLogin text='Create' onPress={()=>createHabit(name,description, privateBool)}/>
    </View>
  )
};

CreateHabitScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  MainParent:{
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    // justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50: 0,
    backgroundColor: '#131B2E',
  },
  TextInputName:{
    backgroundColor:'#fff',
  },
  TextInputDescription:{
    backgroundColor:'#fff',
  },
  Grouped:{
    flexDirection: 'row',
    alignItems:'center',
  },
  Text:{
    color:'white',
  }
});

export default CreateHabitScreen;
