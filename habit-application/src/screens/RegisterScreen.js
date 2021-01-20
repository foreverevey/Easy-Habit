import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, AsyncStorage, ImageBackground} from 'react-native';
import { MyContext } from '../context/authContext';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import {MyContext as ThemeContext} from '../context/themeContext';

const RegisterScreen = ({navigation}) => {
  const {state, signup} = useContext(MyContext);
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenState, setHiddenState] = useState(true)

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
        <Image source={require('../../assets/movie-icon-11.png')} style={styles(themeContext.state.theme).ImageStyle}/>
        <TextInput
          style = {styles(themeContext.state.theme).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(newValue) => setEmail(newValue)}
          placeholder="Email"
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        <View style={styles(themeContext.state.theme).passwordInput}>
          <TextInput
            style = {styles(themeContext.state.theme).inputPass}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(newValue) => setPassword(newValue)}
            placeholder="Password"
            placeholderTextColor={themeContext.state.theme.placeholderText}
            secureTextEntry={hiddenState ? true : false}
          />
          <PasswordLock onPress={()=>{setHiddenState(hiddenState => !hiddenState)}} name={hiddenState? "unlock" : "lock"}/>
        </View>
        <ButtonLogin text='Register' onPress={()=>signup({email,password})}/>
        <SimpleTextLogin/>
        <SimpleTextLogin text={`Already have an acount?
              Login here`} onPress={()=>navigation.navigate('Signin')} style={styles(themeContext.state.theme).NewAcc}/>
      </ImageBackground>
  </View>
  )
};

RegisterScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = (props) => StyleSheet.create({
  input:{
    marginLeft:30,
    paddingLeft:20,
    marginRight:30,
    borderBottomWidth:1,
    borderRadius:30,
    borderColor: props.text,
    marginBottom: 10,
    marginTop:75,
    color: props.text,
  },
  inputPass:{
    flex:1,
    marginTop: 10,
    paddingLeft: 10,
    color: props.text,
  },
  passwordInput:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginLeft:40,
    marginRight:40,
    borderColor: props.text
  },
  MainParent:{
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
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
  },
  ImageBackground:{
    flex: 1,
  },
});

export default RegisterScreen;
