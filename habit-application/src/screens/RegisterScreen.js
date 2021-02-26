import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Image, ImageBackground} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import isEmail from 'validator/lib/isEmail';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import {MyContext} from '../context/authContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

const RegisterScreen = ({navigation}) => {
  const {state, signup} = useContext(MyContext);
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenState, setHiddenState] = useState(true);
  const [loading, setLoading] = useState(false);
  const [badAttempt, setBadAttempt] = useState(false);
  const [emailValidate, setEmailValidate] = useState(true);

  const attemptSignUp = async (email,password) =>{
    const validateEmail = isEmail(email);
    if(validateEmail){
      setLoading(true);
      setEmailValidate(true);
      const attempt = await signup({email,password});
      if(attempt){
        navigation.navigate('Home', {language: languageContext.state.language});
      } else {
        setBadAttempt(true);
        setPassword('');
        setEmail('');
        setLoading(false);
      }
    } else {
      setEmailValidate(false);
    }
  };

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme).spinnerTextStyle}
        />
      </View>
      <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
        <Image source={require('../../assets/appLogo.png')} style={styles(themeContext.state.theme).ImageStyle}/>
        <TextInput
          style = {styles(themeContext.state.theme).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(newValue) => setEmail(newValue)}
          placeholder={languageContext.state.language.userNameInputPlaceholder}
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        <View style={styles(themeContext.state.theme).passwordInput}>
          <TextInput
            style = {styles(themeContext.state.theme).inputPass}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(newValue) => setPassword(newValue)}
            placeholder={languageContext.state.language.passwordInputPlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderText}
            secureTextEntry={hiddenState ? true : false}
            onSubmitEditing={(e)=>{attemptSignUp(email,password)}}
          />
          <PasswordLock onPress={()=>{setHiddenState(hiddenState => !hiddenState)}} name={hiddenState? "unlock" : "lock"}/>
        </View>
        {badAttempt && <View>
          <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.registerScreenWrong}</Text>
        </View>}
        {!emailValidate && <View>
          <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.registerScreenValidate}</Text>
        </View>}
        <ButtonLogin style={styles(themeContext.state.theme).Button} text={languageContext.state.language.register} onPress={()=>attemptSignUp(email,password)}/>
        <SimpleTextLogin/>
        <SimpleTextLogin text={languageContext.state.language.registerScreenSimpleText1} onPress={()=>navigation.navigate('Signin')} style={styles(themeContext.state.theme).NewAcc}/>
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
  Button:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
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
  errorMessage: {
    paddingLeft:40,
    marginTop:10,
    color: props.text,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default RegisterScreen;
