import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import isEmail from 'validator/lib/isEmail';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import MyHeaderSecondary from '../components/HeaderSecondary';
import {MyContext} from '../context/authContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

const ForgotPasswordScreen = ({navigation}) => {
  const {state, signup, forgotPassword, submitCode, submitPassword} = useContext(MyContext);
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [enterCode, setEnterCode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [emailValidate, setEmailValidate] = useState(true);

  const submitEmail = async (email) => {
    const validateEmail = isEmail(email);
    if(validateEmail){
      setLoading(true);
      setEmailValidate(true);
      const attempt = await forgotPassword({email});
      // const attempt = true;
      console.log('attempt', attempt);
      if(attempt){
        setEnterCode(true);
        setLoading(false);
      } else {
        setEmail('');
        setLoading(false);
      }
    } else {
      setEmailValidate(false);
    }
  }

  const sendCode = async (code) => {
    setLoading(true);
    const attempt = await submitCode({email, code});
    // const attempt = true;
    if(attempt){
      setEnterCode(false);
      setChangePassword(true);
      setLoading(false);
    } else {
      setEmail('');
      setLoading(false);
    }
  }

  const sendPassword = async (password) => {
    setLoading(true);
    const attempt = await submitPassword({email, password});
    // const attempt = true;
    if(attempt){
      setChangePassword(false);
      setLoading(false);
      navigation.navigate('Signin');
    } else {
      setEmail('');
      setLoading(false);
    }
  }

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
        {!enterCode && !changePassword && <View>
          <TextInput
            style = {styles(themeContext.state.theme).input}
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(newValue) => setEmail(newValue)}
            placeholder={languageContext.state.language.userNameInputPlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderText}
          />
          {!emailValidate && <View>
            <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.registerScreenValidate}</Text>
          </View>}
          <ButtonLogin style={styles(themeContext.state.theme).Button} text={languageContext.state.language.submit} onPress={()=>submitEmail(email)}/>
      </View>}
      {enterCode && !changePassword && <View>
        <TextInput
          style = {styles(themeContext.state.theme).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={code}
          onChangeText={(newValue) => setCode(newValue)}
          placeholder={languageContext.state.language.CodeInputPlaceholder}
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        {!emailValidate && <View>
          <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.registerScreenValidate}</Text>
        </View>}
        <ButtonLogin style={styles(themeContext.state.theme).Button} text={languageContext.state.language.submit} onPress={()=>sendCode(code)}/>
      </View>}
      {!enterCode && changePassword && <View>
        <TextInput
          style = {styles(themeContext.state.theme).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(newValue) => setPassword(newValue)}
          placeholder={languageContext.state.language.passwordInputPlaceholder}
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        {!emailValidate && <View>
          <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.registerScreenValidate}</Text>
        </View>}
        <ButtonLogin style={styles(themeContext.state.theme).Button} text={languageContext.state.language.submit} onPress={()=>sendPassword(password)}/>
      </View>}
      </ImageBackground>
  </View>
  )
};

ForgotPasswordScreen.navigationOptions = ({navigation}) => {
  const text = 'Forgot Password';
  const { params } = navigation.state;
  const theme = params.theme;
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
};

const styles = (props) => StyleSheet.create({
  MainParent:{
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
  input:{
    marginLeft:30,
    paddingLeft:20,
    marginRight:30,
    borderBottomWidth:1,
    borderRadius:30,
    borderColor: props.text,
    color: props.text,
  },
  ImageBackground:{
    flex: 1,
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF'
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
});

export default ForgotPasswordScreen;
