import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { MyContext } from '../context/authContext';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';

const RegisterScreen = ({navigation}) => {
  const {state, signup} = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenState, setHiddenState] = useState(true)

  return (
    <View style={styles.MainParent}>
      <Image source={require('../../assets/movie-icon-11.png')} style={styles.ImageStyle}/>
      <TextInput
        style = {styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(newValue) => setEmail(newValue)}
        placeholder="Email"
      />
      <View style={styles.passwordInput}>
        <TextInput
          style = {styles.inputPass}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(newValue) => setPassword(newValue)}
          placeholder="Password"
          secureTextEntry={hiddenState ? true : false}
        />
        <PasswordLock onPress={()=>{setHiddenState(hiddenState => !hiddenState)}} name={hiddenState? "unlock" : "lock"}/>
      </View>
      <ButtonLogin text='Register' onPress={()=>signup({email,password})}/>
      <SimpleTextLogin/>
      <SimpleTextLogin text={`Already have an acount?
            Login here`} onPress={()=>navigation.navigate('Signin')} style={styles.NewAcc}/>
    </View>
  )
};

RegisterScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  input:{
    marginLeft:30,
    paddingLeft:20,
    marginRight:30,
    borderBottomWidth:1,
    borderRadius:30,
    borderColor: '#D29082',
    marginBottom: 10,
    marginTop:75,
    color: '#A8ADC2',
  },
  inputPass:{
    flex:1,
    marginTop: 10,
    paddingLeft: 10,
    color: '#A8ADC2',
  },
  passwordInput:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    // borderRadius: 30,
    marginLeft:40,
    marginRight:40,
    borderColor: '#D29082'
  },
  MainParent:{
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#131121',
  },
  NewAcc:{
    alignSelf: 'center',
    marginTop:100,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  ImageStyle:{
    width:150,
    height: 150,
    alignSelf: 'center',
    marginTop: 75,
  }
});

export default RegisterScreen;
